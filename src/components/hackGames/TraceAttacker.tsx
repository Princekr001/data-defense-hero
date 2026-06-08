import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Search, ChevronRight } from "lucide-react";

interface Step {
  id: number;
  prompt: string;
  log: string;
  options: { text: string; correct: boolean; why: string }[];
}

interface Props {
  tier: 1 | 2 | 3;
  onSuccess: () => void;
  onFail: () => void;
}

const KILL_CHAIN: Record<1 | 2 | 3, Step[]> = {
  1: [
    {
      id: 1,
      prompt: "Where did the attacker get in?",
      log: "08:14  auth.log  failed_login user=admin src=203.0.113.7 (x142)",
      options: [
        { text: "Brute-force on the admin login", correct: true, why: "142 failed logins from one IP screams credential brute-force." },
        { text: "Phishing email opened by a user", correct: false, why: "No mail-gateway events appear here — purely auth failures." },
        { text: "USB drop in the office", correct: false, why: "Physical vectors would show endpoint mounts, not network auth." },
      ],
    },
    {
      id: 2,
      prompt: "What did they do once inside?",
      log: "08:22  audit  user=admin downloaded /etc/shadow size=2.1KB",
      options: [
        { text: "Stole hashed password file", correct: true, why: "/etc/shadow is the hashed-password store — classic post-compromise grab." },
        { text: "Patched the server", correct: false, why: "Patching writes to system dirs, doesn't pull /etc/shadow out." },
        { text: "Rebooted the box", correct: false, why: "A reboot would show a sysctl/init event, not a file download." },
      ],
    },
    {
      id: 3,
      prompt: "How are they exfiltrating?",
      log: "08:30  fw  ALLOW 10.0.0.5 -> 185.220.101.12:443 bytes=2120",
      options: [
        { text: "HTTPS upload to attacker host", correct: true, why: "Outbound 443 to an unknown IP carrying the same byte size as the stolen file." },
        { text: "Email attachment", correct: false, why: "SMTP would appear on port 25/587, not 443." },
        { text: "Printed it", correct: false, why: "Printers leave CUPS/spooler events, not firewall flows." },
      ],
    },
  ],
  2: [
    {
      id: 1,
      prompt: "Initial foothold?",
      log: "11:02  mail  user=jdoe clicked link hxxps://acme-vpn.co/login",
      options: [
        { text: "Credential phishing page", correct: true, why: "Look-alike domain (acme-vpn.co vs acme.com) harvesting VPN creds." },
        { text: "SQL injection on the website", correct: false, why: "SQLi shows up in web-server logs, not mail click-through." },
        { text: "Insider with admin badge", correct: false, why: "Insider misuse wouldn't start with an external phishing click." },
      ],
    },
    {
      id: 2,
      prompt: "How did they move laterally?",
      log: "11:18  win-evt 4624 logon_type=3 src=WS-12 dst=DC01 user=jdoe",
      options: [
        { text: "Pass-the-hash to the domain controller", correct: true, why: "Network logon (type 3) from a workstation straight to DC01 with stolen creds." },
        { text: "Physical walk to the server room", correct: false, why: "Doesn't generate a network logon event." },
        { text: "Recompiled the kernel", correct: false, why: "Not a lateral-movement technique and not visible in a 4624 event." },
      ],
    },
    {
      id: 3,
      prompt: "What's their objective?",
      log: "11:41  dlp  pattern=PAN-16digit hits=4,920 dest=cloud-sync",
      options: [
        { text: "Bulk PII / card-number exfil", correct: true, why: "DLP fired on 16-digit card patterns being uploaded to external cloud sync." },
        { text: "Routine backup job", correct: false, why: "A real backup job wouldn't trip DLP on card numbers." },
        { text: "User watching videos", correct: false, why: "Streaming wouldn't match a PAN regex thousands of times." },
      ],
    },
    {
      id: 4,
      prompt: "How do you contain it?",
      log: "11:42  soc  decision pending…",
      options: [
        { text: "Disable user, block dest IP, rotate creds", correct: true, why: "Stop the active session, cut the egress channel, invalidate the stolen credential." },
        { text: "Email the user and wait", correct: false, why: "Exfil is live — waiting loses more data every second." },
        { text: "Reboot the firewall", correct: false, why: "A reboot drops the session briefly but the attacker reconnects." },
      ],
    },
  ],
  3: [
    {
      id: 1,
      prompt: "First anomaly?",
      log: "02:11  edr  scada-op-3 spawned powershell -enc <b64> parent=winword.exe",
      options: [
        { text: "Macro-borne malware from a document", correct: true, why: "winword.exe spawning encoded PowerShell is textbook macro malware." },
        { text: "Scheduled Windows update", correct: false, why: "Updates run under trustedinstaller, not winword." },
        { text: "Operator typing commands", correct: false, why: "An operator wouldn't paste base64 into an interactive shell." },
      ],
    },
    {
      id: 2,
      prompt: "How did they persist?",
      log: "02:14  reg  HKLM\\...\\Run added 'svhost' -> C:\\ProgramData\\u.exe",
      options: [
        { text: "Run-key autostart with a typo-squat name", correct: true, why: "'svhost' (no c) mimics svchost; classic Run-key persistence." },
        { text: "Legitimate Windows service", correct: false, why: "Real svchost.exe lives in System32, not ProgramData." },
        { text: "GPU driver update", correct: false, why: "Driver installs write to driverstore, not Run keys." },
      ],
    },
    {
      id: 3,
      prompt: "What are they targeting?",
      log: "02:33  net  modbus tcp 502 scan 192.168.30.0/24 from scada-op-3",
      options: [
        { text: "Industrial PLCs on the OT network", correct: true, why: "Modbus/502 sweeps map programmable controllers — pre-attack recon on plant gear." },
        { text: "Printers", correct: false, why: "Printers don't speak Modbus." },
        { text: "DNS servers", correct: false, why: "DNS is 53/udp, not 502/tcp." },
      ],
    },
    {
      id: 4,
      prompt: "What stops the kinetic impact?",
      log: "02:34  soc  decision pending…",
      options: [
        { text: "Isolate host, segment IT↔OT, alert plant ops", correct: true, why: "Kill the foothold and put a hard boundary between IT and the live process network." },
        { text: "Shut every plant down nationwide", correct: false, why: "Over-reaction — isolate the affected segment, don't cause your own outage." },
        { text: "Push a Windows patch", correct: false, why: "Patching mid-incident doesn't evict an active attacker." },
      ],
    },
    {
      id: 5,
      prompt: "After-action priority?",
      log: "03:00  ir  recovery phase",
      options: [
        { text: "Rebuild from gold image + rotate all OT creds", correct: true, why: "Persistence may be deeper than detected — trust nothing, rebuild clean." },
        { text: "Delete one Run key and resume", correct: false, why: "Attackers plant multiple persistence; single-key cleanup is wishful." },
        { text: "Post on social media", correct: false, why: "Public disclosure happens through legal/PR, not as a recovery step." },
      ],
    },
  ],
};

export default function TraceAttacker({ tier, onSuccess, onFail }: Props) {
  const steps = useMemo(() => KILL_CHAIN[tier], [tier]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tier === 1 ? 60 : tier === 2 ? 75 : 90);
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

  const choose = (i: number) => {
    if (picked !== null || done) return;
    setPicked(i);
    if (!step.options[i].correct) setMistakes((m) => m + 1);
  };

  const next = () => {
    if (idx + 1 >= steps.length) {
      setDone(true);
      setTimeout(() => (mistakes <= 1 ? onSuccess() : onFail()), 500);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Search className="h-3 w-3" /> Stage {idx + 1}/{steps.length} · mistakes {mistakes}
        </span>
        <span className="font-mono text-primary">{timeLeft}s</span>
      </div>
      <Progress value={progress} className="h-1.5" />

      <div className="rounded-md border border-primary/30 bg-primary/5 p-2.5 font-mono text-[11px] text-primary/90 break-all">
        {step.log}
      </div>

      <p className="text-sm font-semibold text-white">{step.prompt}</p>

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

import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
				body: ['Sora', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
			},
			keyframes: {
				'boss-shake': {
					'0%, 100%': { transform: 'translate3d(0,0,0)' },
					'20%': { transform: 'translate3d(-6px, 3px, 0)' },
					'40%': { transform: 'translate3d(5px, -4px, 0)' },
					'60%': { transform: 'translate3d(-4px, -2px, 0)' },
					'80%': { transform: 'translate3d(4px, 3px, 0)' },
				},
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				'cyber-glow': 'hsl(var(--cyber-glow))',
				'neon-purple': 'hsl(var(--neon-purple))',
				'matrix-green': 'hsl(var(--matrix-green))'
			},
			backgroundImage: {
				'gradient-cyber': 'var(--gradient-cyber)',
				'gradient-danger': 'var(--gradient-danger)', 
				'gradient-success': 'var(--gradient-success)'
			},
			boxShadow: {
				'cyber': 'var(--shadow-cyber)',
				'success': 'var(--shadow-success)',
				'danger': 'var(--shadow-danger)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(var(--cyber-glow) / 0.2)' 
					},
					'50%': { 
						boxShadow: '0 0 30px hsl(var(--cyber-glow) / 0.4)' 
					}
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.1)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'ticker': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				'sms-buzz': {
					'0%,100%': { transform: 'translateX(0)' },
					'20%': { transform: 'translateX(-6px) rotate(-1deg)' },
					'40%': { transform: 'translateX(6px) rotate(1deg)' },
					'60%': { transform: 'translateX(-4px)' },
					'80%': { transform: 'translateX(4px)' }
				},
				'call-ring': {
					'0%,100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-2deg)' },
					'75%': { transform: 'rotate(2deg)' }
				},
				'push-drop': {
					'0%': { transform: 'translateY(-40px)', opacity: '0' },
					'60%': { transform: 'translateY(6px)', opacity: '1' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'bot-bob': {
					'0%,100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'shrink-bar': {
					'0%': { width: '100%' },
					'100%': { width: '0%' }
				},
				'stamp-slam': {
					'0%': { transform: 'scale(3) rotate(-12deg)', opacity: '0' },
					'60%': { transform: 'scale(0.9) rotate(-8deg)', opacity: '1' },
					'100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' }
				},
				'shield-expand': {
					'0%': { transform: 'scale(0)', opacity: '0.9' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'pixel-dissolve': {
					'0%': { opacity: '1', filter: 'blur(0)' },
					'100%': { opacity: '0', filter: 'blur(6px) hue-rotate(90deg)', transform: 'scale(0.4) translateY(20px)' }
				},
				'glitch': {
					'0%,100%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
					'20%': { transform: 'translate(-3px,2px)', filter: 'hue-rotate(45deg)' },
					'40%': { transform: 'translate(3px,-2px)', filter: 'hue-rotate(-30deg)' },
					'60%': { transform: 'translate(-2px,-1px)' },
					'80%': { transform: 'translate(2px,1px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'bounce-in': 'bounce-in 0.4s ease-out',
				'bot-bob': 'bot-bob 2.6s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

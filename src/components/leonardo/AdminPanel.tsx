import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { type LeonardoSettings, loadSettings, saveSettings, DEFAULT_SETTINGS } from "@/config/leonardo";

interface Props {
  onChange: (s: LeonardoSettings) => void;
}

export const AdminPanel = ({ onChange }: Props) => {
  const [settings, setSettings] = useState<LeonardoSettings>(loadSettings());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    saveSettings(settings);
    onChange(settings);
  }, [settings, onChange]);

  const minutes = Math.round(settings.inactivityTimeoutMs / 60000);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Open admin settings"
          className="fixed bottom-3 right-3 z-50 h-8 w-8 rounded-full bg-ink/10 hover:bg-ink/20 text-ink/60 hover:text-ink flex items-center justify-center transition-colors"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-parchment border-gold/40 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-ink">Curator Settings</DialogTitle>
          <DialogDescription className="text-sepia italic">Adjust the kiosk experience.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="devmode" className="font-display text-ink">Demo Mode</Label>
              <p className="text-sm text-sepia">Uses canned Leonardo responses without contacting the backend.</p>
            </div>
            <Switch id="devmode" checked={settings.devMode} onCheckedChange={(v) => setSettings({ ...settings, devMode: v })} />
          </div>

          <div className="space-y-2">
            <Label className="font-display text-ink">Typewriter speed: {settings.typewriterSpeedMs}ms / char</Label>
            <Slider
              min={10} max={80} step={5}
              value={[settings.typewriterSpeedMs]}
              onValueChange={([v]) => setSettings({ ...settings, typewriterSpeedMs: v })}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-display text-ink">Inactivity reset: {minutes} min</Label>
            <Slider
              min={1} max={15} step={1}
              value={[minutes]}
              onValueChange={([v]) => setSettings({ ...settings, inactivityTimeoutMs: v * 60000 })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics" className="font-display text-ink">Analytics logging</Label>
              <p className="text-sm text-sepia">Architecture prepared; disabled by default.</p>
            </div>
            <Switch id="analytics" checked={settings.analyticsEnabled} onCheckedChange={(v) => setSettings({ ...settings, analyticsEnabled: v })} />
          </div>

          <Button variant="outline" className="w-full border-gold/50 text-ink" onClick={() => setSettings(DEFAULT_SETTINGS)}>
            Restore defaults
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

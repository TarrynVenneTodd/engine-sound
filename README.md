# Engine Sound

A personal engine sound for the Tesla browser. Eight engines (cross-plane V8, flat-plane V8, V10, V12, air-cooled flat-six, inline-4 turbo with anti-lag, turbo diesel and 2-rotor rotary) are synthesized live, sample by sample, and follow GPS speed through a virtual gearbox with rev-matched downshifts, a rev limiter and overrun pops.

No audio files, no accounts, no trackers, no network calls. It runs offline once loaded.

Open the page, press Start Engine, set Speed to GPS and allow location. Tap the GPS chip at the top to see whether location readings are arriving.

## Credits

Ideas, not code, came from these projects:

- xevrion/ignis (https://github.com/xevrion/ignis): the exhaust signal as cam-gated blowdown pressure, per-bank delay-line pipes, the two-bank cross-plane burble, spark-cut afterfire, and pops as their own percussive voice. That repository has no license file, so only ideas were used.
- Antonio-R1/engine-sound-generator (https://github.com/Antonio-R1/engine-sound-generator), MIT: the AudioWorklet engine with separate intake, block and exhaust sources, each with its own waveguide.
- markeasting/engine-audio (https://github.com/markeasting/engine-audio), MIT: RPM, throttle and load driving a layered Web Audio graph.

Free for personal use.

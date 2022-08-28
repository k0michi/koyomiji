import { Observable } from "kyoka";
import { Entry } from "./entry.js";
import { compareArray, toPathname } from "./utils.js";

export interface InitialData {
  entries: { [key: string]: Entry };
  isIndexComplete: boolean;
}

export class Model {
  entries: Observable<{ [key: string]: Entry }>;
  assets: Observable<{ [key: string]: any }>;
  isIndexComplete: Observable<boolean>;

  constructor(data: InitialData) {
    this.entries = new Observable(data.entries);
    this.assets = new Observable({});
    this.isIndexComplete = new Observable<boolean>(data.isIndexComplete);
  }

  getEntry(path: string[]) {
    const entries = this.entries.get();
    const pathname = toPathname(path);
    const entry = entries[pathname];

    if (entry?.content != null) {
      return entry;
    }

    throw fetch('/' + path.join('/') + '/entry.json').then(e => e.json()).then(e => {
      entries[pathname] = e;
      this.entries.set(this.entries.get());
    });
  }

  checkIfIndexComplete() {
    if (!this.isIndexComplete.get()) {
      throw fetch('/entries.json').then(r => r.json()).then(e => {
        this.isIndexComplete.set(true);

        for (const [key, value] of Object.entries(e)) {
          const entries = this.entries.get();
          console.log(value)
          entries[key] = { ...entries[key], ...(value as any) };
        }

        this.entries.set(this.entries.get());
      });
    }
  }

  async fetchAssets() {
    const assets: { [key: string]: any } = {};
    assets['logoFull'] = (await import('./assets/koyomiji_full_hr.svg?raw')).default;
    assets['asterisk'] = (await import('./assets/asterisk.svg?raw')).default;
    assets['mailIcon'] = (await import('@tabler/icons/mail.svg?raw')).default;
    assets['githubIcon'] = (await import('@tabler/icons/brand-github.svg?raw')).default;
    assets['youtubeIcon'] = (await import('@tabler/icons/brand-youtube.svg?raw')).default;
    assets['twitchIcon'] = (await import('@tabler/icons/brand-twitch.svg?raw')).default;
    assets['calenderIcon'] = (await import('@tabler/icons/calendar-time.svg?raw')).default;
    assets['tagsIcon'] = (await import('@tabler/icons/tags.svg?raw')).default;
    this.assets.set(assets);
  }
}
import { Observable } from "kyoka";
import { Entry } from "./entry.js";
import { compareArray } from "./utils.js";

export interface InitialData {
  entries: Entry[];
}

export class Model {
  entries: Observable<Entry[]>;
  assets: Observable<{ [key: string]: any }>;

  constructor(data: InitialData) {
    this.entries = new Observable(data.entries);
    this.assets = new Observable({});
  }

  getEntry(path: string[]) {
    const entries = this.entries.get();
    const index = entries.findIndex(p => compareArray(p.path, path));

    if (entries[index]?.content != null) {
      return entries[index];
    }

    throw fetch('/' + path.join('/') + '/entry.json').then(e => e.json()).then(e => {
      if (index != -1) {
        this.entries.get()[index] = e;
      } else {
        this.entries.get().push(e);
      }

      this.entries.set(this.entries.get());
    });
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
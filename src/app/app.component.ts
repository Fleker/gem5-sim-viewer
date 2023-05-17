import { Component, ElementRef, ViewChild } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('fileviewer') dfileViewer?: ElementRef
  @ViewChild('configviewer') dconfigViewer?: ElementRef
  @ViewChild('sysviewer') dsystemViewer?: ElementRef
  @ViewChild('configsvg') configSvgEl?: ElementRef<HTMLImageElement>
  configSvg?: string
  configJson?: any
  directoryHandler: any
  loadedFiles: any[] = []
  fileViewer = {
    filename: '',
    contents: '',
  }
  stats: any
  statsKeys: any
  statsPanel: any

  stringify(x: any) {
    return JSON.stringify(x)
  }

  convertKeysToNestedArray() {
    const keys = Object.keys(this.stats)
    const tree: any[] = [];
    
    for (const key of keys) {
      const path = key.split('.');
      let node = tree;
  
      for (let i = 0; i < path.length; i++) {
        const label = path[i];
        const key = path.slice(0, i + 1).join('.');
        let child = node.find(child => child.label === label);
  
        if (!child) {
          child = { label, key, children: [] };
          node.push(child);
        }
  
        node = child.children;
      }
    }
    
    return tree;
  }
  
  async loadFolder() {
    this.directoryHandler = await window.showDirectoryPicker()
    this.loadedFiles = []
    this.stats = {}
    const regex = new RegExp(`([\\w.:]+)\\s+([\\w\\d.]+)\\s+#(.+)`)
    for await (const entry of this.directoryHandler.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile()
        this.loadedFiles.push(file)
        if (entry.name === 'config.dot.svg') {
          const svg = await file.text()
          const start = svg.indexOf('<svg')
          this.configSvg = `data:image/svg+xml;base64,${btoa(svg.substring(start))}`
          // this.configSvgEl!.nativeElement!.src = this.configSvg
        }
        if (entry.name === 'config.json') {
          const configJson = JSON.parse(await file.text())
          if (!Array.isArray(configJson.system.cpu)) {
            configJson.system.cpu = [configJson.system.cpu]
          }
          this.configJson = configJson
        }
        if (entry.name === 'stats.txt') {
          const statTxt = await file.text()
          const stats: string[] = statTxt.split('\n')
          for (const stat of stats) {
            const matcher = stat.match(regex)
            if (matcher) {
              const [_, field, value, body] = matcher
              const modField = field
                .replace('cpu.data', 'cpu_data')
                .replace('cpu.inst', 'cpu_inst')
                .replace('inst.arm', 'inst_arm')
                .replace('inst.quiesce', 'inst_quiesce')
                .replace('::', '.')
              this.stats[modField] = {value, body}
            }
          }
          this.statsPanel = this.convertKeysToNestedArray()
          this.statsKeys = Object.keys(this.stats)
          console.log(this.statsPanel)
        }
      }
    }
    console.debug(this.loadedFiles)
  }

  async openFileViewer(file: any) {
    this.dfileViewer?.nativeElement.showModal()
    const filename = file.name
    const contents = await file.text()
    this.fileViewer = {
      filename,
      contents,
    }
  }

  async openConfigViewer() {
    this.dconfigViewer?.nativeElement.showModal()
  }

  async openSystemViewer() {
    this.dsystemViewer?.nativeElement.showModal()
  }

  close() {
    this.dconfigViewer?.nativeElement.close()
    this.dfileViewer?.nativeElement.close()
    this.dsystemViewer?.nativeElement.close()
  }
}

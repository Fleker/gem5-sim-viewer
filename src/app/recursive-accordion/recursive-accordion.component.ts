import { Component, Input } from '@angular/core';

interface StatPanel {
  label: string
  key: string
  children: StatPanel[]
}

type StatMap = Record<string, {value: string, body: string}>

@Component({
  selector: 'recursive-accordion',
  templateUrl: './recursive-accordion.component.html',
  styleUrls: ['./recursive-accordion.component.css']
})
export class RecursiveAccordionComponent {
  @Input('stats') stats: StatMap = {}
  @Input('statsPanel') statsPanel: StatPanel[] = []
}

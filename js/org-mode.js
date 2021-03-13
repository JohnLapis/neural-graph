Rainbow.defer = true
Rainbow.extend('orgmode', [
  {
    matches: {
      1: 'heading',
      2: [
        {
          name: 'heading-todo-keyword',
          pattern: /!|S|(&gt;){2}|=&gt;|TODO/g,
        },
        {
          name: 'heading-done-keyword',
          pattern: /§(&gt;)?|§|∞|=|DONE/g,
        },
        {
          name: 'heading-text',
          pattern: /[^(§(&gt;)?)(§)(∞)(=)(DONE)(!)(S)((&gt;){2})(=&gt;)(TODO)]*/g
        }
      ],
      3: 'heading-text',
      4: 'tag',
    },
    pattern: /^(\*+)( \S*?)?( .*?)?((?<= ):\w+:$)?$/gm,
  },
  {
    name: 'list',
    pattern: /^\s*?([-+]|\s+\*|\d+[).])\s/gm,
  },
  {
    name: 'italic',
    pattern: /(?<=^|[.,:;\s])\/[^\/\n]+?\/(?=$|[.,:;\s])/gm,
  },
  {
    name: 'bold',
    pattern: /(?<=^|[.,:;\s])\*[^\*\n]+?\*(?=$|[.,:;\s])/gm,
  },
  {
    name: 'underline',
    pattern: /(?<=^|[.,:;\s])_[^_\n]+?_(?=$|[.,:;\s])/gm,
  },
  {
    name: 'strikethrough',
    pattern: /(?<=^|[.,:;\s])\+[^\+\n]+?\+(?=$|[.,:;\s])/gm,
  },
  {
    name: 'link',
    pattern: /\[(?:\[([^\]]*)\])?\[([^\]]*)\]\]/g,
  },
  {
    name: 'drawer',
    pattern: /^:(.+):$/gm,
  },
  {
    name: 'comment',
    pattern: /#.*/g,
  },
  {
    name: 'table',
    pattern: /^\|.*?\|$/gm,
  },
  {
    name: 'dollar-keyword',
    pattern: /(^|\s)\$[\w\d\/']+\b/gm,
  },
  {
    name: 'percent-keyword',
    pattern: /(^|\s)%[\w\d\/']+\b/gm,
  },
  {
    matches: {
      1: 'todo-keyword',
      2: 'done-keyword',
      3: 'idea-keyword',
      4: 'update-keyword',
      5: 'important-keyword'
    },
    pattern: /\b(TODO)|(DONE)|(IDEA)|(UPDATE)|(IMP)\b/g,
  },
])

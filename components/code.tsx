import * as React from 'react';

interface CodeProps {
  display: string;
  lang?: string;
  children: string;
}

export default function Code(props: CodeProps) {
  const [html, setHTML] = React.useState<string>();
  const lang = props.lang;

  React.useEffect(() => {
    if (lang != undefined) {
      (async () => {
        const Prism = await import('prismjs');
        await import('../prism-languages.js');
        const html = Prism.highlight(props.children, Prism.languages[lang], lang);
        setHTML(html);
      })();
    }
  }, []);

  const className = lang != undefined ? `language-${lang}` : 'language-none';

  return (props.display == 'block' ?
    html != undefined ?
      <pre className={className}><code className={className} dangerouslySetInnerHTML={{ __html: html }}></code></pre> :
      <pre className={className}><code className={className}>{props.children}</code></pre>
    :
    html != undefined ?
      <code className={className} dangerouslySetInnerHTML={{ __html: html }}></code> :
      <code className={className}>{props.children}</code>
  );
}
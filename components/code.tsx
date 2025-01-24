import * as React from 'react';

interface CodeProps {
  display?: string;
  lang?: string;
  title?: string;
  children: string;
}

export default function Code(props: CodeProps) {
  const [html, setHTML] = React.useState<string>();
  const lang = props.lang;

  React.useEffect(() => {
    if (lang != undefined) {
      (async () => {
        const Prism = await import('prismjs');
        await import('../lib/prism-languages.js');
        const html = Prism.highlight(props.children, Prism.languages[lang], lang);
        setHTML(html);
      })();
    }
  }, [props.children]);

  const className = lang != undefined ? `language-${lang}` : 'language-none';
  const showTitle = props.title != undefined;

  return (props.display == 'block' ?
    html != undefined ?
      <pre className={className}>{showTitle ? <div className='code-title'>{props.title}</div> : null}<code className={className} dangerouslySetInnerHTML={{ __html: html }}></code></pre> :
      <pre className={className}>{showTitle ? <div className='code-title'>{props.title}</div> : null}<code className={className}>{props.children}</code></pre>
    :
    html != undefined ?
      <code className={className} dangerouslySetInnerHTML={{ __html: html }}></code> :
      <code className={className}>{props.children}</code>
  );
}
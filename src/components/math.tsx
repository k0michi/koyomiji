import * as React from 'react';
let Katex: typeof import('katex').default;

interface MathProps {
  display: string;
  children: string;
}

export function Math(props: MathProps) {
  const [html, setHTML] = React.useState<string>();

  React.useEffect(() => {
    import('katex').then(m => {
      Katex = m.default;
      const html = Katex.renderToString(props.children, { displayMode: props.display == 'block' });
      setHTML(html);
    })
  }, []);

  return (props.display == 'block' ?
    html != undefined ?
      <div className="math-block" dangerouslySetInnerHTML={{ __html: html }}></div> :
      <div className="math-block">{props.children}</div>
    :
    html != undefined ?
      <span className="math-inline" dangerouslySetInnerHTML={{ __html: html }}></span> :
      <span className="math-inline">{props.children}</span>
  );
}
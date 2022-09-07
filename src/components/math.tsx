import * as React from 'react';

interface MathProps {
  display: string;
  children: string;
}

export default function Math(props: MathProps) {
  const [html, setHTML] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      const Katex = (await import('katex')).default;
      const html = Katex.renderToString(props.children, { displayMode: props.display == 'block' });
      setHTML(html);
    })();
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
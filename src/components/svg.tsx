import * as React from 'react';

interface SVGProps {
  loader: () => Promise<string>;
  className?: string;
}

export default function SVG(props: SVGProps) {
  const [imported, setImported] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      const content = await props.loader();
      setImported(content);
    })();
  }, []);

  if (imported != null) {
    return <div className={props.className} dangerouslySetInnerHTML={{ __html: imported }} />;
  } else {
    return <div className={props.className} />;
  }
}
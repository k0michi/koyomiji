import * as React from 'react';
import { differenceInDays, previousSaturday, nextSunday } from 'date-fns';
import chroma from 'chroma-js';

interface CalenderGraphProps {
  begin: Date;
  end: Date;
  data: Date[];
}

export default function CalenderGraph(props: CalenderGraphProps) {
  const [counted, setCounted] = React.useState<number[]>([]);

  React.useEffect(() => {
    const totalDays = differenceInDays(props.end, props.begin);
    const counted = new Array<number>(totalDays + 1);
    counted.fill(0);

    for (const d of props.data) {
      const diffDay = differenceInDays(d, props.begin);

      if (diffDay >= 0 && diffDay < counted.length) {
        counted[diffDay]++;
      }
    }

    console.log(counted)
    setCounted(counted);
  }, []);

  const beginOffset = differenceInDays(previousSaturday(props.begin), props.begin);
  const endOffset = differenceInDays(nextSunday(props.end), props.begin);

  return (
    <table className="calender-graph">
      <tbody>
        {
          range(0, 7, 1).map(i => <tr> {
            range(beginOffset, endOffset, 7).map(j => {
              const index = i + j;
              let color;

              if (index >= 0 && index < counted.length) {
                color = chroma.scale('OrRd').domain([0, 10])(counted[index]);

                return <td className='cell' style={{ backgroundColor: color.css() }} />;
              } else {
                return <td className='cell' />;
              }
            })}
          </tr>)
        }
      </tbody>
    </table>
  );
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
function range(start: number, stop: number, step: number) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
};
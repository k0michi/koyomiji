import * as React from 'react';
import { nextSaturday, previousSunday, differenceInCalendarDays } from 'date-fns';
import chroma from 'chroma-js';

interface CalenderGraphProps {
  begin: Date;
  end: Date;
  data: Date[];
}

export default function CalenderGraph(props: CalenderGraphProps) {
  const [counted, setCounted] = React.useState<number[]>([]);

  React.useEffect(() => {
    const totalDays = differenceInCalendarDays(props.end, props.begin);
    const counted = new Array<number>(totalDays + 1);
    counted.fill(0);

    for (const d of props.data) {
      const diffDay = differenceInCalendarDays(d, props.begin);

      if (diffDay >= 0 && diffDay < counted.length) {
        counted[diffDay]++;
      }
    }

    setCounted(counted);
  }, []);

  const beginOffset = differenceInCalendarDays(previousSunday(props.begin), props.begin);
  const endOffset = differenceInCalendarDays(nextSaturday(props.end), props.begin);

  return (
    <table className="calender-graph">
      <tbody>
        {
          range(0, 7, 1).map(i => <tr key={i}> {
            range(beginOffset, endOffset + 1, 7).map(j => {
              const index = i + j;
              let color;

              if (index >= 0 && index < counted.length) {
                const count = counted[index];

                if (count == 0) {
                  color = chroma('#444');
                } else {
                  color = chroma.scale('YlGn').domain([0, 10])(count);
                }

                return <td className='cell' key={j} style={{ backgroundColor: color.css() }} />;
              } else {
                return <td className='cell' key={j} />;
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
  return Array.from({ length: (stop - start) / step }, (_, i) => start + (i * step));
};
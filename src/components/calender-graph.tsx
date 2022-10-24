import * as React from 'react';
import { nextSaturday, previousSunday, differenceInCalendarDays, add, format } from 'date-fns';
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
          range(beginOffset - 7, endOffset + 1, 7).map(j => {
            const lastDay = add(props.begin, { days: j + 6 });

            if (lastDay.getDate() <= 7) {
              return <td className='cell' key={j}>{format(lastDay, 'LLL')}</td>;
            }

            return <td className='cell' key={j} />;
          })
        }
        {
          range(0, 7, 1).map(i => <tr key={i}> {
            range(beginOffset - 7, endOffset + 1, 7).map(j => {
              const index = i + j;

              if (j == beginOffset - 7) {
                if (i % 3 == 0) {
                  const day = add(props.begin, { days: index });
                  return <td className='cell week' key={j}>{format(day, 'eee')}</td>;
                } else {
                  return <td className='cell week' key={j} />;
                }
              }

              let color;

              if (index >= 0 && index < counted.length) {
                const count = counted[index];

                if (count > 0) {
                  color = chroma.scale('YlGn').domain([0, 10])(count + 1);
                  return <td className='cell filled' key={j} style={{ backgroundColor: color.css() }} />;
                } else {
                  return <td className='cell filled' key={j} />;
                }
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
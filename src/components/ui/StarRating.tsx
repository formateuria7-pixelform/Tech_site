import React from 'react';
import { StarIcon } from 'lucide-react';
import { cx } from '../../lib/format';

export function StarRating({
  value,
  size = 'md',
  showValue = false




}: {value: number;size?: 'sm' | 'md';showValue?: boolean;}) {
  const dimension = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-1.5" aria-label={`Note ${value.toFixed(1)} sur 5`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) =>
        <StarIcon
          key={i}
          className={cx(dimension, i <= Math.round(value) ? 'fill-volt text-volt' : 'text-paper/25')} />

        )}
      </div>
      {showValue && <span className="font-mono text-xs text-fog">{value.toFixed(1)} / 5</span>}
    </div>);

}
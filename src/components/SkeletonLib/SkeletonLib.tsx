import { Skeleton } from '@mui/material';

interface SkeletonLibProps {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  width?: number | string;
  height?: number | string;
}

export default function SkeletonLib({
  variant = 'rounded',
  width = 210,
  height = 60
}: SkeletonLibProps) {
  return (
    <>
      <Skeleton variant={variant} width={width} height={height} />
    </>
  );
}

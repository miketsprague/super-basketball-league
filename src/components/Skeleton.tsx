interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonLeagueTableRow() {
  return (
    <tr className="border-b border-gray-100 bg-white" aria-hidden="true">
      <td className="py-3 px-2"><Skeleton className="h-4 w-4" /></td>
      <td className="py-3 px-2"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3 px-2 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
      <td className="py-3 px-2 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
      <td className="py-3 px-2 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
      <td className="py-3 px-2 text-center hidden sm:table-cell"><Skeleton className="h-4 w-8 mx-auto" /></td>
      <td className="py-3 px-2 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
    </tr>
  );
}

export function SkeletonMatchCard() {
  return (
    <div
      className="w-full bg-white rounded-lg shadow p-4 border-l-4 border-gray-200"
      aria-hidden="true"
    >
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDateGroup() {
  return (
    <div aria-hidden="true">
      <div className="py-2 px-1 -mx-1 rounded bg-gray-50">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-3 mt-2">
        <SkeletonMatchCard />
        <SkeletonMatchCard />
      </div>
    </div>
  );
}

/**
 * @file PerformanceDashboard.tsx
 * @description Development dashboard for performance metrics
 */

'use client';

import React from 'react';
import type { GPUProfileStats } from '@/lib/performance/gpuProfiler';
import type { FrameBudgetReport } from '@/lib/performance/frameBudget';
import type { LeakReport } from '@/lib/performance/memoryLeakDetector';

interface PerformanceDashboardProps {
  gpuStats: Map<string, GPUProfileStats> | null;
  budgetReport: FrameBudgetReport | null;
  memoryLeaks: LeakReport | null;
}

export function PerformanceDashboard({ gpuStats, budgetReport, memoryLeaks }: PerformanceDashboardProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-full text-xs bg-black/75 text-white rounded shadow-lg overflow-hidden">
      <div className="px-3 py-2 bg-black/60 font-semibold">Performance Dashboard</div>

      {/* GPU Stats */}
      <div className="px-3 py-2 border-t border-white/10">
        <div className="font-medium mb-1">GPU Time Breakdown</div>
        {gpuStats && gpuStats.size > 0 ? (
          <div className="space-y-1">
            {Array.from(gpuStats.values()).map((s) => (
              <div key={s.label} className="flex justify-between">
                <span>{s.label}</span>
                <span>{s.avgMs.toFixed(2)}ms avg</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/60">No GPU data</div>
        )}
      </div>

      {/* Frame Budget */}
      <div className="px-3 py-2 border-t border-white/10">
        <div className="font-medium mb-1">Frame Budget</div>
        {budgetReport ? (
          <div>
            <div className="flex justify-between">
              <span>Total</span>
              <span>{budgetReport.total.toFixed(2)}ms / {budgetReport.budgetMs.toFixed(2)}ms</span>
            </div>
            <div className={`mt-1 ${budgetReport.overBudget ? 'text-red-300' : 'text-green-300'}` }>
              {budgetReport.overBudget ? 'Over Budget' : 'Within Budget'}
            </div>
            <div className="mt-2 max-h-24 overflow-auto space-y-1">
              {budgetReport.entries.map((e) => (
                <div key={e.label} className="flex justify-between">
                  <span>{e.label}</span>
                  <span>{e.timeMs.toFixed(2)}ms ({e.percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-white/60">No budget data</div>
        )}
      </div>

      {/* Memory Leaks */}
      <div className="px-3 py-2 border-t border-white/10">
        <div className="font-medium mb-1">Memory Leaks</div>
        {memoryLeaks ? (
          <div>
            <div>Total Leaks: {memoryLeaks.totalLeaks}</div>
            {memoryLeaks.totalLeaks > 0 && (
              <div className="mt-1 max-h-24 overflow-auto space-y-1">
                {memoryLeaks.details.slice(0, 5).map((d, i) => (
                  <div key={`${d.type}-${i}`} className="flex justify-between">
                    <span>{d.type}</span>
                    <span className="truncate max-w-[50%]" title={d.label}>{d.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-white/60">No leak data</div>
        )}
      </div>
    </div>
  );
}


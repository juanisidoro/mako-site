interface PipelineStep {
  title: string;
  subtitle: string;
  detail: string;
}

function parseAsciiPipeline(text: string): PipelineStep[] | null {
  const lines = text.trim().split('\n');
  // Detect box-drawing chars pattern: ┌─ or ──►
  const hasBoxChars = lines.some((l) => /[┌┐└┘│─►]/.test(l));
  if (!hasBoxChars || lines.length < 4) return null;

  // Extract content from between box borders
  // Each box has 3-4 content lines between ┌...┐ and └...┘
  const boxes: string[][] = [];
  let current: string[] = [];
  let inBox = false;

  for (const line of lines) {
    if (line.includes('┌')) {
      // Count boxes on this line by counting ┌
      const count = (line.match(/┌/g) || []).length;
      if (boxes.length === 0) {
        for (let i = 0; i < count; i++) boxes.push([]);
      }
      inBox = true;
      continue;
    }
    if (line.includes('└')) {
      inBox = false;
      continue;
    }
    if (inBox && line.includes('│')) {
      // Split by ──► or multiple │ to get box contents
      const segments = line.split(/\s*──►\s*/).map((s) => s.trim());
      for (let i = 0; i < segments.length && i < boxes.length; i++) {
        const content = segments[i].replace(/│/g, '').trim();
        if (content) boxes[i].push(content);
      }
    }
  }

  if (boxes.length < 2) return null;

  return boxes.map((b) => ({
    title: b[0] || '',
    subtitle: b[1] || '',
    detail: b[2] || '',
  }));
}

export function PipelineDiagram({ code }: { code: string }) {
  const steps = parseAsciiPipeline(code);
  if (!steps) return null;

  return (
    <div className="my-6 overflow-x-auto">
      <div className="inline-flex items-center gap-0 min-w-max py-2 px-1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            {/* Step box */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3.5 min-w-[140px]">
              <p className="text-sm font-semibold text-emerald-400 whitespace-nowrap">
                {step.title}
              </p>
              {step.subtitle && (
                <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">
                  {step.subtitle}
                </p>
              )}
              {step.detail && (
                <p className="text-xs text-slate-500 mt-0.5 font-mono whitespace-nowrap">
                  {step.detail}
                </p>
              )}
            </div>
            {/* Arrow */}
            {i < steps.length - 1 && (
              <div className="flex items-center px-2 text-emerald-500/50">
                <div className="w-6 h-px bg-emerald-500/40" />
                <svg className="h-3 w-3 -ml-px" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M4 1l6 5-6 5V1z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Checks if a code block contains an ASCII pipeline diagram.
 */
export function isAsciiPipeline(text: string): boolean {
  const lines = text.trim().split('\n');
  return lines.some((l) => /[┌┐└┘]/.test(l)) && lines.some((l) => l.includes('──►'));
}

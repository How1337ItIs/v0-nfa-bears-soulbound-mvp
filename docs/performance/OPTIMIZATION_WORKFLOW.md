# Performance Optimization Workflow

## Step 1: Measure Baseline

```bash
npm run perf:measure-baseline
```

## Step 2: Identify Bottlenecks
- Use GPU Profiler to find expensive passes
- Use Frame Budget Analyzer to find CPU bottlenecks
- Check Memory Leak Detector for resource leaks

## Step 3: Optimize
- Reduce shader complexity
- Lower quality settings
- Optimize uniforms (cache values)
- Batch draw calls

## Step 4: Validate
```bash
npm run test:performance
npm run perf:regression-check
```

## Step 5: Document
Update SHADER_EFFECTS_BENCHMARK.md with new metrics


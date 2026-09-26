# VANTA — Android Targets

## Performance
- Base target: 30 FPS on supported mid-range devices.
- High-end target: 60 FPS where thermals allow.
- Dynamic resolution and device scalability are required.

## Presets
**Low:** aggressive LOD, short shadow distance, low foliage/effects.

**Medium:** balanced lighting, foliage and effects.

**High:** higher resolution, shadows and effects.

**Ultra:** maximum supported visual quality for flagship hardware.

## Optimization checklist
- World streaming / HLOD
- Mesh and material LODs
- Occlusion culling
- Instanced foliage
- Texture mip/VRAM budgets
- Async asset loading
- Object pooling for NPCs/traffic
- Thermal and battery profiling

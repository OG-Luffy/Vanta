# VANTA — Technical Architecture

## Runtime layers
1. Input layer — touch/controller abstraction.
2. Character layer — movement, interaction and animation state.
3. Vehicle layer — physics and surface response.
4. World layer — streamed cells, level-of-detail and population.
5. Mission layer — objectives, triggers and rewards.
6. Persistence layer — profile, world state and settings.
7. Presentation layer — lighting, weather, audio and UI.

## World streaming
Use Unreal Engine 5 World Partition/HLOD in production. Keep distant regions lightweight and stream high-detail assets only near the player.

## Rendering
Use physically based materials, baked/real-time lighting according to mobile budget, distance-based effects, texture streaming, mesh LODs and dynamic resolution.

## Physics
Use fixed-step simulation where appropriate. Keep the number of active rigid bodies bounded by distance and gameplay relevance.

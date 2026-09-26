// VANTA vehicle-physics prototype.
// Production implementation should use Unreal Engine's vehicle/physics systems.

export const VEHICLE_DEFAULTS = {
  massKg: 1450,
  maxSpeedKph: 190,
  engineForce: 8200,
  brakeForce: 11500,
  traction: 1.0,
  rollingResistance: 0.018,
  aeroDrag: 0.00042
};

export function stepVehicle(vehicle, input, dt) {
  const throttle = Math.max(0, Math.min(1, input.throttle ?? 0));
  const brake = Math.max(0, Math.min(1, input.brake ?? 0));
  const steer = Math.max(-1, Math.min(1, input.steer ?? 0));
  const speed = Math.max(0, vehicle.speedMps);
  const aero = VEHICLE_DEFAULTS.aeroDrag * speed * speed;
  const rolling = VEHICLE_DEFAULTS.rollingResistance * speed;
  const acceleration = (throttle * VEHICLE_DEFAULTS.engineForce - brake * VEHICLE_DEFAULTS.brakeForce - aero - rolling) / VEHICLE_DEFAULTS.massKg;
  vehicle.speedMps = Math.max(0, Math.min(VEHICLE_DEFAULTS.maxSpeedKph / 3.6, speed + acceleration * dt));
  vehicle.yaw += steer * (1.4 / (1 + speed * 0.04)) * dt;
  vehicle.x += Math.cos(vehicle.yaw) * vehicle.speedMps * dt;
  vehicle.z += Math.sin(vehicle.yaw) * vehicle.speedMps * dt;
  return vehicle;
}

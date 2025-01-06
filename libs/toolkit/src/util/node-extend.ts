export async function spawnAsync(command: string, args: string[]) {
  const { spawn } = await import("child_process");

  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    child.on("error", reject);
    child.on("exit", resolve);
  });
}

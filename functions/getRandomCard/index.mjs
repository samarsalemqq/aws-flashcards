// Runs once per execution environment (cold start) and is reused by
// every later invocation in the same environment.
const cards = [
  { q: "CPU-bound Lambda", a: "Increase memory" },
  { q: "Temporary files during invocation", a: "/tmp" },
  { q: "Shared libraries across functions", a: "Lambda Layer" },
  { q: "Rotate DB credentials automatically", a: "Secrets Manager" },
  { q: "Run every 10 minutes", a: "EventBridge schedule" },
];

export const handler = async (event, context) => {
  // Runtime information comes from `context`, not `event`.
  const requestId = context.awsRequestId;

  const card = cards[Math.floor(Math.random() * cards.length)];

  // Anything written with console.log goes to CloudWatch Logs.
  console.log(`[${requestId}] served card: ${card.q}`);

  return {
    statusCode: 200,
    body: JSON.stringify(card),
  };
};

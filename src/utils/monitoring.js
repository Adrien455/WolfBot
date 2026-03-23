const stats = {
  requests: 0,
  total_latency: 0,
  processed: {
    get: 0,
    post: 0,
    put: 0
  }
};

function log_request(latency)
{
  stats.requests++;
  stats.total_latency += latency;
}

function log_processed(type)
{
  stats.processed[type]++;
}

function report()
{
  const avg_latency = stats.requests ? (stats.total_latency / stats.requests).toFixed(2) : 0;

  console.log("=== BOT STATS ===");
  console.log({
    req_per_sec: (stats.requests / 10).toFixed(2),
    avg_latency: avg_latency + " ms",
    processed: stats.processed
  });
  console.log();

  stats.requests = 0;
  stats.total_latency = 0;
  stats.processed = { get: 0, post: 0, put: 0 };
}

module.exports = {
  log_request,
  log_processed,
  report
};
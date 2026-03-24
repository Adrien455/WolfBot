const stats = {
  requests: 0,
  total_latency: 0,
  api_errors: 0,
  network_errors: 0,
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

function log_api_errors()
{
  stats.api_errors++;
}

function log_network_errors()
{
  stats.network_errors++;
}

function report()
{
  const avg_latency = stats.requests ? (stats.total_latency / stats.requests).toFixed(2) : 0;

  console.log("=== BOT STATS ===");

  console.log({
    req_per_sec: (stats.requests / 10).toFixed(2),
    avg_latency: avg_latency + " ms",
    api_errors: stats.api_errors,
    network_errors: stats.network_errors,  // not sure of the name
    processed: stats.processed
  });

  console.log();

  stats.requests = 0;
  stats.total_latency = 0;
  stats.processed = { get: 0, post: 0, put: 0 };
  stats.api_errors = 0;
  stats.network_errors = 0;
}

module.exports = {
  log_request,
  log_processed,
  log_api_errors,
  log_network_errors,
  report
};
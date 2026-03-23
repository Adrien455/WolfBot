let running = true;

function get_running()
{
    return running;
}

function stop_pollers()
{
    running = false;
}

module.exports = { get_running, stop_pollers };
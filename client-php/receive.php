<?php

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;

$BROKER_PASSWORD=getenv ("BROKER_PASSWORD");
$BROKER_USER=getenv ("BROKER_USER");
$BROKER_HOST=getenv ("BROKER_HOST");

$connection = new AMQPStreamConnection($BROKER_HOST, 5672, $BROKER_USER, $BROKER_PASSWORD);
$channel = $connection->channel();


$callback = function ($msg) {
    echo ' [x] Received ', $msg->body, "\n";
};

$channel->basic_consume('youtube-response', '', false, true, false, false, $callback);

while ($channel->is_open()) {
    $channel->wait();
}

$channel->close();
$connection->close();
?>
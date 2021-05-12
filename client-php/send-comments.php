<?php

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use PhpAmqpLib\Wire\AMQPTable;

//get the connection parameters
$BROKER_PASSWORD=getenv ("BROKER_PASSWORD");
$BROKER_USER=getenv ("BROKER_USER");
$BROKER_HOST=getenv ("BROKER_HOST");

$connection = new AMQPStreamConnection($BROKER_HOST, 5672, $BROKER_USER, $BROKER_PASSWORD);
$channel = $connection->channel();

//this is a uniq id that identifies this query
$id=uniqid();
//this is the queue where the response will be published
$response_queue="youtube-response";
//this is the id of the video for which we want to have metadatas
$video_id="gPHgRp70H8o";
//this is the name of the task that uses Youtube API to get video details
$task_name="youtube.scrap_comment";

$properties = array(
    'content_type' => 'application/json', 
    "content_encoding" =>	"utf-8",
    "correlation_id" => $id,
    "reply_to" => $response_queue,
    'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT);

//we pass the Id of the video as a parameter in the body
$body='[["'.$video_id.'"], {}, {"callbacks": null, "errbacks": null, "chain": null, "chord": null}]';
$msg = new AMQPMessage($body,$properties);

$channel->queue_declare($response_queue, false, true, false, false);

$headers = new AMQPTable(array(

"id" =>	$id,
"root_id" => $id,
"origin" => 	"php-server",
"task" =>	$task_name,
));
 
$msg->set('application_headers', $headers);
$channel->basic_publish($msg, "", 'celery');




?>

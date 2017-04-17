<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "Watcher_Dayneko";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Ошибка подключеня к БД: " . $conn->connect_error);
$conn->set_charset("utf8");

$params = explode("/", $_SERVER['PATH_INFO']);

/* Для определения того, выводятся ли у нас все новости или 1 */
$isItem = false;
$itemValue = 0;
if (isset($params[2])) {
    $isItem = true;
    $itemValue = $params[2];
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        //echo 'GET';
        if ($isItem) {
            //echo 'хотим одну новость';
            $sql = "SELECT * FROM newss WHERE id=".$itemValue;
            $result = $conn->query($sql);
            $resultData = array();
            while($row = $result->fetch_assoc()) {
                $resultData = array(
                    "id" => $row["id"],
                    "title" => $row["title"],
                    "text" => $row["text"],
                    "author" => $row["author"]
                );
            }
            echo json_encode($resultData);
        }else{
            //echo 'хотим все11!';
            $limit = $_GET["limit"];
            $start = $_GET["start"];
            $sql = "SELECT * FROM newss LIMIT $limit OFFSET $start";
            /* Для определения количества страниц */
            $sqlCount = $conn->query("SELECT COUNT(*) FROM newss");
            $sqlCount =$sqlCount->fetch_array();
            $result = $conn->query($sql);
            $resultData = array( "data" => array(), "meta" => array("totalCount" => 6/*$sqlCount[0]*/) );
            while($row = $result->fetch_assoc()) {
                $resultData["data"][] = array(
                    "id" => $row["id"],
                    "title" => $row["title"],
                    "text" => $row["text"],
                    "author" => $row["author"]
                );
            }
            echo json_encode($resultData);
        }
        break;
    case 'POST':
        //echo 'POST';
        $put = json_decode(file_get_contents("php://input"), true);
        $title = $put["title"];
        $text = $put["text"];
        $author = $put["author"];
        $sql = "INSERT into newss VALUES(null, '$title', '$text', '$author')";
        $conn->query($sql);
        // Определение максимального индекса в БД
        $result = $conn->query("SELECT MAX(id) FROM newss");
        $row = $result->fetch_array();
        $highest_id = $row[0];
        //
        echo json_encode(
            array(
                "id"=>$highest_id,
                "title"=>$put["title"],
                "text"=>$put["text"],
                "author"=>$put["author"]
            )
        );
        break;
    case 'PUT':
        $put = json_decode(file_get_contents("php://input"), true);
        $sql = "UPDATE newss SET title='" . $put["title"] . "', text='" . $put["text"] . "', author='" . $put["author"] . "' WHERE id=" . $put["id"];
        $conn->query($sql);
        //вставляю для ответа в приложение в формате JSON(требование по тз)
        $sql = "SELECT * FROM newss WHERE id=".$put["id"];
        $result = $conn->query($sql);
        $resultData = array();
        while($row = $result->fetch_assoc()) {
            $resultData = array(
                "id" => $row["id"],
                "title" => $row["title"],
                "text" => $row["text"],
                "author" => $row["author"]
            );
        }
        echo json_encode($resultData);
        break;
    case 'DELETE':
        //echo 'DELETE';
        $sql = "DELETE FROM newss WHERE id = " . $itemValue;
        $conn->query($sql);

        break;
    default:
        echo "error request";
}

$conn->close();
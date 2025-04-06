// --- グローバル定数 ---
// ★★★ あなたのLIFF IDに置き換えてください ★★★
const liffId = "2007212345-q37WaY8r";
// ★★★ あなたのGASウェブアプリURL(.../exec)に置き換えてください ★★★
const gasWebAppUrl = "https://script.google.com/macros/s/AKfycbwSevDp8FsrWT7c_275n3KMYBHHxZY12pZ6rJ05kqyNhHYX0myFHvIFrVeCV_Mf4WV8/exec";

// --- LIFFアプリの初期化とメイン処理 ---
async function main() {
    try {
        console.log("LIFF アプリを初期化します...");
        await liff.init({ liffId: liffId });
        console.log("LIFF 初期化完了");

        if (!liff.isLoggedIn()) {
            console.log("LINEにログインしていません。ログインします。");
            liff.login();
            return;
        }
        console.log("LINEログイン済みです。");

        // 候補日の表示と送信処理の設定
        setupBookingForm();

    } catch (error) {
        console.error("LIFF 初期化中にエラーが発生しました:", error);
        displayError("LIFFアプリの読み込みに失敗しました。");
    }
}

// --- 予約フォーム関連の処理 ---
function setupBookingForm() {
    const dateOptionsDiv = document.getElementById('date-options');
    const sendButton = document.getElementById('send-button');
    const statusMessageDiv = document.createElement('div'); // 状態表示用のdivを追加
    statusMessageDiv.id = 'status-message';
    sendButton.parentNode.insertBefore(statusMessageDiv, sendButton.nextSibling); // 送信ボタンの後に追加

    let selectedDate = null; // 選択された日付を保持

    // 仮の候補日データ
    const availableDates = ["7月10日(水) 10:00", "7月11日(木) 14:00", "7月12日(金) 19:00"];

    console.log("候補日ボタンを作成します:", availableDates);

    // 候補日ボタンの生成とクリックイベント
    availableDates.forEach(dateString => {
        const button = document.createElement('button');
        button.textContent = dateString;
        button.classList.add('date-button');
        button.onclick = () => {
            console.log(`日付選択: ${dateString}`);
            selectedDate = dateString;
            sendButton.disabled = false;
            statusMessageDiv.textContent = ''; // 状態メッセージをクリア
            document.querySelectorAll('.date-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        };
        dateOptionsDiv.appendChild(button);
    });

    // --- 送信ボタンクリック時の処理 ---
    sendButton.onclick = async () => {
        if (!selectedDate) {
            displayError("予約希望日時を選択してください。");
            return;
        }

        // ボタンを無効化し、処理中メッセージを表示
        sendButton.disabled = true;
        statusMessageDiv.textContent = '送信中...';
        statusMessageDiv.style.color = 'blue';

        try {
            // 1. ユーザープロファイルを取得してuserIdを取得
            console.log("ユーザープロファイルを取得します...");
            const profile = await liff.getProfile();
            const userId = profile.userId;
            console.log(`UserID取得: ${userId}`);

            // 2. GASにデータを送信
            console.log(`GAS (${gasWebAppUrl}) にデータを送信します...`);
            const postData = {
                userId: userId,
                selectedDate: selectedDate
            };

            const response = await fetch(gasWebAppUrl, {
                method: 'POST',
                headers: {
                    // GAS Web Appでは通常Content-Type指定は必須ではないが、念のため
                    'Content-Type': 'application/json'
                },
                // GAS側は e.postData.contents をJSON.parseするので、文字列化して送る
                body: JSON.stringify(postData),
                // mode: 'no-cors' は使用しない (GASはCORS対応不要で、応答を取得したい)
            });

            console.log(`GASからの応答ステータス: ${response.status}`);

            // 3. GASからの応答を処理
            if (!response.ok) {
                 // ネットワークエラーや500系エラーなど
                 throw new Error(`サーバーとの通信に失敗しました。(Status: ${response.status})`);
            }

            const result = await response.json(); // GASからのJSON応答をパース
            console.log("GASからの応答:", result);

            if (result.status === 'success') {
                // 成功した場合
                statusMessageDiv.textContent = '予約希望を送信しました！';
                statusMessageDiv.style.color = 'green';
                 // 少し待ってからLIFFを閉じる (任意)
                setTimeout(() => {
                    liff.closeWindow();
                }, 2000); // 2秒後に閉じる
            } else {
                // GAS側でエラーがあった場合
                throw new Error(result.message || 'サーバー側でエラーが発生しました。');
            }

        } catch (error) {
            console.error("送信処理中にエラーが発生しました:", error);
            displayError(`送信に失敗しました: ${error.message}`);
            // エラーが発生したらボタンを再度有効化する
            sendButton.disabled = false;
            statusMessageDiv.textContent = ''; // エラー時は処理中メッセージを消す
        }
    };
}

// --- ユーティリティ関数 ---
function displayError(message) {
    const statusMessageDiv = document.getElementById('status-message');
    if (statusMessageDiv) {
        statusMessageDiv.textContent = message;
        statusMessageDiv.style.color = 'red';
    } else {
        alert(message); // statusMessageDiv がなければアラートで表示
    }
}

// --- LIFF アプリを実行 ---
main();
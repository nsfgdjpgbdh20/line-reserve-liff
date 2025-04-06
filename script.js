// LIFFアプリの初期化とメイン処理
async function main() {
    // 1. LIFF ID を設定 ※後で新しいLIFF IDに置き換えます
    const liffId = "ここに新しいLIFF_IDを設定"; // ★★★ 後で必ず新しいIDに書き換える ★★★

    // 2. LIFF アプリの初期化
    try {
        console.log("LIFF アプリを初期化します...");
        await liff.init({ liffId: liffId });
        console.log("LIFF 初期化完了");

        // 3. LINEにログインしているか確認
        if (!liff.isLoggedIn()) {
            console.log("LINEにログインしていません。ログインします。");
            liff.login();
            return;
        }
        console.log("LINEログイン済みです。");

        // 4. 候補日の表示
        displayDateOptions();

    } catch (error) {
        console.error("LIFF 初期化中にエラーが発生しました:", error);
        alert("LIFFアプリの読み込みに失敗しました。");
    }
}

// 候補日ボタンを表示する関数
function displayDateOptions() {
    const dateOptionsDiv = document.getElementById('date-options');
    const sendButton = document.getElementById('send-button');
    let selectedDate = null; // 選択された日付を保持する変数

    // 仮の候補日データ
    const availableDates = ["7月10日(水) 10:00", "7月11日(木) 14:00", "7月12日(金) 19:00"];

    console.log("候補日ボタンを作成します:", availableDates);

    availableDates.forEach(dateString => {
        const button = document.createElement('button');
        button.textContent = dateString;
        button.classList.add('date-button');

        // --- ボタンクリック時の処理 ---
        button.onclick = () => {
            console.log(`日付が選択されました: ${dateString}`);
            selectedDate = dateString; // 選択された日付を記憶
            sendButton.disabled = false; // 送信ボタンを有効化

            // --- 選択状態の見た目を変更 ---
            document.querySelectorAll('.date-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
            // --- ここまで ---
        };
        // --- ボタンクリック時の処理 ここまで ---

        dateOptionsDiv.appendChild(button);
    });

    console.log("候補日ボタンの作成完了");

    // --- 送信ボタンクリック時の処理 ---
    sendButton.onclick = async () => {
        if (!selectedDate) {
            alert("予約希望日時を選択してください。");
            return;
        }

        console.log(`送信ボタンクリック: ${selectedDate} を送信します`);
        try {
            const message = {
                type: 'text',
                text: `予約希望: ${selectedDate}` // 送信するメッセージ内容
            };
            console.log("liff.sendMessages を呼び出します:", message);
            await liff.sendMessages([message]); // メッセージ送信
            console.log("メッセージ送信成功");

            console.log("LIFFウィンドウを閉じます...");
            liff.closeWindow(); // 送信後にウィンドウを閉じる

        } catch (error) {
            console.error("メッセージ送信中にエラーが発生しました:", error);
            alert(`メッセージの送信に失敗しました: ${error.message}`);
        }
    };
    // --- 送信ボタンクリック時の処理 ここまで ---
}

// LIFF アプリを実行
main();
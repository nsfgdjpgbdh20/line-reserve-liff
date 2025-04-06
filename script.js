// LIFFアプリの初期化とメイン処理
async function main() {
    // 1. LIFF ID を設定 ※後でLINE Developersコンソールで取得した値に置き換えます
    const liffId = "2007212345-xRWLXJ1O"; // 必ず後で置き換えてください！

    // 2. LIFF アプリの初期化
    try {
        console.log("LIFF アプリを初期化します...");
        await liff.init({ liffId: liffId });
        console.log("LIFF 初期化完了");

        // 3. LINEにログインしているか確認
        if (!liff.isLoggedIn()) {
            console.log("LINEにログインしていません。ログインします。");
            // ログインしていなければ、ログインページにリダイレクト
            liff.login();
            return; // ログイン処理に移行するため、ここで処理を中断
        }
        console.log("LINEログイン済みです。");

        // 4. 候補日の表示（仮）
        displayDateOptions();

    } catch (error) {
        console.error("LIFF 初期化中にエラーが発生しました:", error);
        alert("LIFFアプリの読み込みに失敗しました。");
    }
}

// 候補日ボタンを表示する関数（仮実装）
function displayDateOptions() {
    const dateOptionsDiv = document.getElementById('date-options');
    const sendButton = document.getElementById('send-button');

    // 仮の候補日データ (将来は動的に生成する)
    const availableDates = ["7月10日(水) 10:00", "7月11日(木) 14:00", "7月12日(金) 19:00"];

    console.log("候補日ボタンを作成します:", availableDates);

    availableDates.forEach(dateString => {
        const button = document.createElement('button');
        button.textContent = dateString;
        button.classList.add('date-button'); // CSSでスタイルを適用するためクラスを追加

        // --- ボタンクリック時の処理 ---
        button.onclick = () => {
            console.log(`日付が選択されました: ${dateString}`);
            // TODO: 選択状態の管理と送信ボタンの有効化処理を追加
            alert(`「${dateString}」を選択しました。\n（まだ送信機能は実装されていません）`);
            // とりあえず送信ボタンを有効化してみる（後でちゃんと選択状態を管理する）
            sendButton.disabled = false;
            // TODO: 選択されたボタンを目立たせる処理も追加したい
        };
        // --- ボタンクリック時の処理 ここまで ---

        dateOptionsDiv.appendChild(button); // HTMLにボタンを追加
    });

    console.log("候補日ボタンの作成完了");

    // --- 送信ボタンクリック時の処理（仮） ---
    sendButton.onclick = () => {
        // TODO: 選択された日付を取得してメッセージを送信する処理を追加
        alert("送信ボタンがクリックされました。\n（まだメッセージ送信機能は実装されていません）");
        // liff.sendMessages([{ type: 'text', text: 'ここに送信メッセージ' }])
        //   .then(() => { liff.closeWindow(); }) // 送信後ウィンドウを閉じる
        //   .catch((err) => { console.error('メッセージ送信エラー', err); });
    };
    // --- 送信ボタンクリック時の処理 ここまで ---
}


// LIFF アプリを実行
main();
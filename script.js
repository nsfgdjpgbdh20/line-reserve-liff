// LIFFアプリの初期化とメイン処理
async function main() {
    const liffId = "2007212345-xRWLXJ1O"; // あなたのLIFF ID

    try {
        console.log("--- プロフィール取得テスト 開始 ---");
        await liff.init({ liffId: liffId });
        console.log("LIFF 初期化完了");

        if (!liff.isLoggedIn()) {
            console.log("未ログイン。ログインします。");
            liff.login();
            return;
        }
        console.log("ログイン済み。");

        // ★★★ liff.getProfile() を試す ★★★
        console.log("liff.getProfile() を呼び出します...");
        try {
            const profile = await liff.getProfile();
            console.log("★★★ プロフィール取得成功！ ★★★");
            console.log("プロフィール情報:", profile);
            alert(`こんにちは、${profile.displayName} さん！`); // プロフィール表示

            // ★★★★★ ここから追加 ★★★★★
            console.log("続けて liff.sendMessages() のテストを実行します...");
            try {
                const testMessage = {
                    type: 'text',
                    text: 'プロフィール取得後の送信テストです！' // 固定メッセージ
                };
                console.log("liff.sendMessages を呼び出し:", testMessage);
                await liff.sendMessages([testMessage]);
                console.log("★★★ メッセージ送信テスト成功！ ★★★");
                // 送信成功したらアラートでお知らせ（closeWindowはしない）
                alert("テストメッセージの送信に成功しました！トーク画面を確認してください。");
                liff.closeWindow(); // メッセージ送信成功したら閉じる

            } catch (sendMessageError) {
                console.error("XXX メッセージ送信テスト中にエラー XXX");
                console.error("エラーオブジェクト:", sendMessageError);
                // 送信失敗したらアラートでお知らせ
                alert(`テストメッセージの送信に失敗しました: ${sendMessageError.message}`);
            }
            // ★★★★★ ここまで追加 ★★★★★

        } catch (profileError) {
            console.error("XXX プロフィール取得中にエラー XXX");
            console.error("エラーオブジェクト:", profileError);
            alert(`プロフィールの取得に失敗しました: ${profileError.message}`);
        }
        // ★★★ ここまで ★★★

    } catch (initError) {
        console.error("LIFF 初期化中にエラーが発生しました:", initError);
        alert("LIFFアプリの読み込みに失敗しました。");
    } finally {
        console.log("--- プロフィール取得テスト 終了 ---");
    }
}

// 候補日ボタンを表示する関数（仮実装）
function displayDateOptions() {
    const dateOptionsDiv = document.getElementById('date-options');
    const sendButton = document.getElementById('send-button');
    let selectedDate = null; // ★★★ 選択された日付を保持する変数を追加 ★★★

    // 仮の候補日データ (将来は動的に生成する)
    const availableDates = ["7月10日(水) 10:00", "7月11日(木) 14:00", "7月12日(金) 19:00"];

    console.log("候補日ボタンを作成します:", availableDates);

    availableDates.forEach(dateString => {
        const button = document.createElement('button');
        button.textContent = dateString;
        button.classList.add('date-button'); // CSSでスタイルを適用するためクラスを追加

        // --- ボタンクリック時の処理 (修正) ---
        button.onclick = () => {
            console.log(`日付が選択されました: ${dateString}`);
            selectedDate = dateString; // ★★★ 選択された日付を記憶 ★★★
            sendButton.disabled = false; // ★★★ 送信ボタンを有効化 ★★★

            // --- 選択状態の見た目を変更する処理（追加） ---
            // まず全てのボタンから 'selected' クラスを削除
            document.querySelectorAll('.date-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            // クリックされたボタンに 'selected' クラスを追加
            button.classList.add('selected');
            // --- ここまで ---

            // alert(`「${dateString}」を選択しました。\n（まだ送信機能は実装されていません）`); // ← アラートは削除してもOK
        };
        // --- ボタンクリック時の処理 ここまで ---

        dateOptionsDiv.appendChild(button); // HTMLにボタンを追加
    });

    console.log("候補日ボタンの作成完了");

    sendButton.onclick = async () => { // ★★★ async を追加 ★★★
        if (!selectedDate) {
            // 通常はボタンが無効なのでここには来ないはずだが、念のため
            alert("予約希望日時を選択してください。");
            return;
        }

        console.log(`送信ボタンクリック: ${selectedDate} を送信します`);
        // ★★★ LINEにメッセージを送信する処理 ★★★
        try {
            console.log("★★★ 固定メッセージで送信テスト ★★★");
            const simpleMessage = {
                type: 'text',
                text: 'テストメッセージ送信' // ★★★ 変数を使わない固定の文字列 ★★★
            };
            console.log("liff.sendMessages を呼び出します:", simpleMessage);
            await liff.sendMessages([simpleMessage]); // ★★★ 固定メッセージで実行 ★★★
            console.log("メッセージ送信成功");
            liff.closeWindow();
        } catch (error) {
            console.error("メッセージ送信中にエラーが発生しました:", error);
            // ★★★ エラーメッセージをより詳細に出力 ★★★
            alert(`メッセージ送信失敗:\n${error.message}\n${error.stack || ''}`);
        }
        // ★★★ ここまで ★★★

        // alert("送信ボタンがクリックされました。\n（まだメッセージ送信機能は実装されていません）"); // ← 古いアラートは削除
    };
    // --- 送信ボタンクリック時の処理 ここまで ---
}

// LIFF アプリを実行
main();
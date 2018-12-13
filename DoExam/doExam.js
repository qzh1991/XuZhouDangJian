function main() {
    let results = []
    let main = $('div.main');
    if(main[0]==null) {
        console.log('网页错误')
        return
    }
    let questions = main.find('td[class="hs11"]:even');
    let answers = main.find('td[class="hs11"]:odd');
    let array = []
    for (let i = 0; i < questions.length; i++) {
        let v = questions[i];
        let lineTxt = $(v).text().trim();
        lineTxt = lineTxt.replace(/\s+/g, '');
        array.push(lineTxt);
    }
    console.log(array)
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://193.112.163.17:3000/',
        // url: 'http://localhost:3000',
        data: {
            'name': 'XuZhouDangJian',
            'text': JSON.stringify(array)
        },
        success: function(r) {
            console.log(r)
            for (let i = 0; i < answers.length; i++) {
                let answer = answers[i];
                let answerInput = $(answer).find('input');
                let answerText = $(answer).find('label');
                let a = r[i]
                if (a.s == 1) {
                    for (let j = 0; j < answerText.length; j++) {
                        let v = $(answerText[j]).text();
                        if ((a.a).indexOf(v.slice(0, 1)) >= 0 ||
                            (a.a).indexOf(v.slice(v.length - 1, v.length)) >= 0) {
                            $(answerInput[j]).attr('checked', 'true');
                            $(answerInput[j])[0].checked = true;
                        };
                    };
                }else{
                    window.prompt('以下题目未找到答案，请手动选择。',a.a);
                }
            };
        },
    });

}
$(function() {
    // if(window.document.location.pathname=='/wanbi.aspx'){
    //     location.href='index.aspx'
    // }
    // if($('a[href="login.aspx"]')[0]){
    //     $('a[href="login.aspx"]')[0].click()
    // }
    // setTimeout(() => {
    //     if($('a[href="index.aspx"]')[0]){
    //         $('a[href="index.aspx"]')[0].click()
    //     }
    // }, 500);
    // $('#ImageButton1').removeAttr('onclick')
    main()
})
$('#to-petapoco').click(function () {
    convertCode(new ToPetaPocoConverter());
});

$('#to-sql').click(function () {
    convertCode(new ToSqlConverter());
});

function convertCode(converter) {
    var code = $('#source-code').val();
    code = converter.convert(code);
    $('#finished-code').html(code);
}

function ToPetaPocoConverter() {
    var normalizationRegex = /'^\r\n(.*)\r\n$'/g;
    var normalizationRegex2 = /"\r\n|\n\r|\n|\r/;
    var lineRegex = /^(.*?)\r?$/mg;
    exposeMethods();

    function exposeMethods() {
        this.convert = convert;

    }

    function convert(code) {
        //code = code.replace(normalizationRegex, '\r\n');
        //code = code.replace(normalizationRegex2, '\r\n');
        code = code.replace(lineRegex, '.Append("$1")');
        //code = code.replace(/.Append.*= @[a-zA-Z]?\)/), '.Append("$1")');
        code = 'new Sql()\r\n' + code;
        return code;
    }

    return {
        convert: convert
    }
}


function ToSqlConverter() {
    var newSqlRegex = /new Sql\(\)/;
    var normalizationRegex2 = /"\r\n|\n\r|\n|\r/;
    var lineRegex = /^\s*?\t*?.Append\("(.*?)".*?\)\r?$/mg;
    exposeMethods();

    function exposeMethods() {
        this.convert = convert;

    }

    function convert(code) {
        code = code.replace(newSqlRegex, '');
        code = code.replace(lineRegex, '$1');
        return code;
    }

    return {
        convert: convert
    }
}

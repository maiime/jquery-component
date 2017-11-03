@for /F %%i IN ('dir /AD-H /B') do @if %%i NEQ qunit (@if %%i NEQ .vscode (@if %%i NEQ docs (@xcopy .\%%i\*.js .\docs\jqc-js\ /y & @xcopy .\%%i\css .\docs\jqc-css\ /y /s)))

rem merge test for idea
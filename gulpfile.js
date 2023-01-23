import browserSync from "browser-sync" // аналог liveServer
import gulp from "gulp" // что бы работали все фишки gulp
import del from "del" // удаляет папки и файлы
import pug from "gulp-pug" // для компиляции pug файлов
import coreSass from "sass" //  для компиляции sass файлов
import gulpSass from "gulp-sass" //  для компиляции sass файлов
import autoprefixer from "gulp-autoprefixer" // будет сам дописывать префиксы (-moz, -webkit)
import concat from "gulp-concat" // склеивание несколько файлов в один
import uglify from "gulp-uglify-es" // плагин для js на es6
import imagemin from "gulp-imagemin" // сжимать изображения
import cache from "gulp-cache" // что бы картинки не сжимались повторно
import gcmq from "gulp-group-css-media-queries" // что б медиа запросы были в конце файла (групировать их)
import cleanCSS from "gulp-clean-css" //красиво форматировать css код (что б поддерживался всеми браузерами)

const sass = gulpSass(coreSass) 

export const browserSyncFunc = () => {
    browserSync({ 
        server: {
            baseDir: "docs" // базовая дериктория (в результате создасться папка с готовым сайтом)
        },
        open: true, // будет ли открываться автоматически браузер при запуске gulp
        browser: "chrome"
        //port: 8080 // иногда возникает конфликт портов 
    })
} //

export const html = () => {
    return gulp //возвращает gulp команды
    .src([
        "src/pug/*.pug" // указывает где мы будем искать файлы pug
    ])
    .pipe(pug({
        // pretty:true // розтавляет нормальные табуляции вложености и вид в html документа
    }))
    .pipe(gulp.dest("docs")) // куда отправляються скомпилеваные pug файлы
    .pipe(browserSync.reload({
        stream: true // отпрявляется команда что станица в браузере обновилась
    }))
}

export const css = () => {
    return gulp
    .src([
        "src/sass/*.css", // указывает где мы будем искать файлы sass и компилировать их в 1
        "src/sass/*.sass"
    ])
    .pipe(sass({
        outputStyle: "compressed" // compressed(в одну строчку), expanded(розширеный по селекторам и стилям), compact(каджый селектор в одну строчку)
    })
    .on("error", sass.logError)) // функция которая проверяет на ошибки
    .pipe(autoprefixer(["last 15 versions"], { //дописывать префиксы (-moz, -webkit) на 15 версий браузеров старее, с самой новой и старее
        cascade: true // что бы префиксы правильно перекрывались по каскадности
    }))
    .pipe(gcmq("styles.css")) // ищет медиа запросы и групирует их
    .pipe(concat("styles.css")) // все файлы css в один
    .pipe(cleanCSS({
        compatibility: "ie8" // совместимость с интернет експлоером
    }))
    .pipe(gulp.dest("docs/css")) // кидать css файлы в docs папку
    .pipe(browserSync.reload({
        stream: true // отпрявляется команда что станица в браузере обновилась
    }))
}

export const js = () => {
    return gulp //возвращает gulp команды
    .src([
        "src/js/**/*.js" // любая папка на любом уровне вложенности где мы будем искать файлы js
    ])
    .pipe(uglify.default()) // наш синтаксис es6 переделывать на синтаксис который будет поддерживать старыми браузерами, и немного сжимать его
    .pipe(concat("scripts.js")) // конкатинировать все в один файл
    .pipe(gulp.dest("docs/js")) // кидать js файлы в docs папку
    .pipe(browserSync.reload({
        stream: true // отпрявляется команда что станица в браузере обновилась
    }))
}

// когда работаем есть рабочие файлы и есть продакшн версия файлов, что бы все не скидывалось в одну кучу
export const files = () => { 
    return gulp
    .src([
        "src/*.*"
    ], {dot: true}) // все файлы которые начинаються с точки
    .pipe(gulp.dest("docs"))
    .pipe(browserSync.reload({
        stream: true
    }))
}

export const fonts = () => { // для шрифтов
    return gulp
    .src([
        "src/fonts/**/*.*"
    ])
    .pipe(gulp.dest("docs/fonts"))
    .pipe(browserSync.reload({
        stream: true
    }))
}

export const images = () => { // для изображений
    return gulp
    .src([
        "src/img/**/*.*"
    ])
    .pipe(cache(imagemin())) // для сжимания изображений
    .pipe(gulp.dest("docs/img"))
    .pipe(browserSync.reload({
        stream: true
    }))
}

export const clear = () => { // для очистки кеша
    return cache.clearAll()
}

export const delDocs = () => { // для удаления папки Docs
    return del("docs")
}

export const watch = () => { // следит за любымими изменениями в проекте
    gulp.watch("src/sass/**/*.sass", gulp.parallel(css)) // в случае изменения паралельно вызывай css файл
    gulp.watch("src/js/**/*.js", gulp.parallel(js)) // в случае изменения паралельно вызывай js файл
    gulp.watch("src/pug/**/*.pug", gulp.parallel(html)) // в случае изменения паралельно вызывай html файл
    gulp.watch("src*.*", gulp.parallel(files)) // в случае изменения паралельно вызывай html файл
    gulp.watch("src/fonts/**/*.*", gulp.parallel(fonts)) // в случае изменения паралельно вызывай html файл
    gulp.watch("src/img/**/*.*", gulp.parallel(images)) // в случае изменения паралельно вызывай html файл
}

export default gulp.series ( //запускает все таски
    delDocs,
    gulp.parallel(
        watch,
        html,
        css,
        js,
        files,
        fonts,
        images,
        browserSyncFunc
    )
)
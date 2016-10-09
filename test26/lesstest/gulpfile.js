var gulp = require('gulp');
    less = require('gulp-less');
    notify = require('gulp-notify');
    plumber = require('gulp-plumber');
    cssmin = require('gulp-minify-css');//- 压缩CSS为一行
    sourcemaps = require('gulp-sourcemaps');
    rev = require('gulp-rev');//- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector');//- 路径替换
    // cmdPack = require('gulp-cmd-pack');
    // uglify = require('gulp-uglify');
    imagemin = require('gulp-imagemin');
    del = require('del');

//异常处理
gulp.task('testPlumber', function () {
    gulp.src('src/less/index.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less())
        .pipe(gulp.dest('build/stylesheets'));
});
//less图片压缩
gulp.task('lesstestImagemin', function () {
    gulp.src('src/less/image/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(rev())              
        .pipe(gulp.dest('build/stylesheets/image')) 
        .pipe(rev.manifest())     
        .pipe(gulp.dest('rev/revimg/lessimg'));
});
//less转为css
gulp.task('testLess', function () {
    gulp.src('src/less/index.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(rev())              //- 文件名加MD5后缀
        .pipe(gulp.dest('build/stylesheets')) //- 输出文件本地
        .pipe(rev.manifest())     //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/revless/css'));//- 将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('revcss',function(){
    gulp.src(['rev/*/*/*.json','build/stylesheets/insex.css'])
    .pipe(revCollector())             
    .pipe(gulp.dest('build/stylesheets')); 
})
gulp.task('lessrev', function() {
    gulp.src(['rev/revimg/lessimg/*.json','build/stylesheets/*.css']) 
        .pipe(revCollector())             
        .pipe(gulp.dest('build/stylesheets')); 
});

gulp.task('testImagemin', function () {
    gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(rev())              
        .pipe(gulp.dest('build/img')) 
        .pipe(rev.manifest())     
        .pipe(gulp.dest('rev/revless/img'));
});
gulp.task('rev', function() {
    gulp.src(['rev/revless/*/*.json','index.html']) //- 读取 rev-manifest.json 文件以及需要进行名字替换的文件
        .pipe(revCollector())             //- 执行文件内名字的替换
        .pipe(gulp.dest('build'));  //- 替换后的文件输出的目录
});


//监听事件
gulp.task('testWatch', function () {
    gulp.watch('src/less/index.less', ['testPlumber','testLess']); 
//当所有less文件发生改变时，调用testLess任务
});
 
//清除build文件夹
gulp.task('clean', function(){
  del(['build'])
});

gulp.task('default',['testPlumber','lesstestImagemin','testLess','lessrev','testImagemin','rev'],function(){
    setTimeout(
        function(){
            gulp.src(['rev/*/*/*.json','build/stylesheets/*.css'])
            .pipe(revCollector())           
            .pipe(gulp.dest('build/stylesheets')); 
            console.log('release over');
        },4000
    )
})
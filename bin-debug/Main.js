var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    Main.getInstance = function () {
        return this;
    };
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.showPanel = function (task, tag) {
        if (tag == "taskpanel not accept" || tag == "taskpanel submit") {
            Main.taskPanelContent1.text = "任务进行状态：无";
            Main.taskPanelContent1.x = 200;
            Main.taskPanelContent1.y = 630;
            Main.taskPanelContent1.size = 40;
            Main.taskPanelContent2.text = "";
            Main.taskPanelContent3.text = "";
            Main.taskPanelContent4.text = "";
        }
        else if (tag == "taskpanel accept") {
            Main.taskPanelContent1.text = "任务名称: " + task.getName();
            Main.taskPanelContent1.x = 200;
            Main.taskPanelContent1.y = 380;
            Main.taskPanelContent1.size = 30;
            Main.taskPanelContent2.text = "发布任务NPC: " + task.getFromNpcId();
            Main.taskPanelContent2.x = 200;
            Main.taskPanelContent2.y = 430;
            Main.taskPanelContent2.size = 30;
            Main.taskPanelContent3.text = "完成任务NPC: " + task.getToNpcId();
            Main.taskPanelContent3.x = 200;
            Main.taskPanelContent3.y = 480;
            Main.taskPanelContent3.size = 30;
            Main.taskPanelContent4.text = "任务状态： " + task.getStatus();
            Main.taskPanelContent4.x = 200;
            Main.taskPanelContent4.y = 530;
            Main.taskPanelContent4.size = 30;
        }
        if (tag == "accept") {
            Main.content1.text = "任务名称: " + task.getName();
            Main.content1.x = 200;
            Main.content1.y = 380;
            Main.content2.text = "发布任务NPC: " + task.getFromNpcId();
            Main.content2.x = 200;
            Main.content2.y = 430;
            Main.content3.text = "完成任务NPC: " + task.getToNpcId();
            Main.content3.x = 200;
            Main.content3.y = 480;
            Main.content4.text = "任务状态： " + task.getStatus();
            Main.content4.x = 200;
            Main.content4.y = 530;
            Main.button.x = 300;
            Main.button.y = 580;
            Main.button.text = "接受任务";
            Main.button.textColor = 0xFFFF00;
            Main.button.touchEnabled = true;
            Main.button.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                TaskService.getInstance().accept(task.getId());
                Main.button.text = "";
                Main.content1.text = "";
                Main.content2.text = "";
                Main.content3.text = "";
                Main.content4.text = "";
            }, this);
        }
        else if (tag == "finish") {
            Main.content1.text = "任务名称: " + task.getName();
            Main.content1.x = 200;
            Main.content1.y = 600;
            Main.content2.text = "发布任务NPC: " + task.getFromNpcId();
            Main.content2.x = 200;
            Main.content2.y = 650;
            Main.content3.text = "完成任务NPC: " + task.getToNpcId();
            Main.content3.x = 200;
            Main.content3.y = 700;
            Main.content4.text = "任务状态： " + task.getStatus();
            Main.content4.x = 200;
            Main.content4.y = 750;
            Main.button.x = 300;
            Main.button.y = 800;
            Main.button.text = "完成任务";
            Main.button.touchEnabled = true;
            Main.button.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                TaskService.getInstance().finish(task.getId());
                Main.button.text = "";
                Main.content1.text = "";
                Main.content2.text = "";
                Main.content3.text = "";
                Main.content4.text = "";
            }, this);
        }
    };
    p.showEmoji = function (emoji) {
        if (emoji == "yellow !") {
            Main.n0Emoji.text = "！";
            Main.n0Emoji.x = 60;
            Main.n0Emoji.y = 150;
            Main.n0Emoji.size = 200;
            Main.n0Emoji.textColor = 0xFFFF00;
        }
        else if (emoji == "yellow ?") {
            Main.n0Emoji.text = "";
            Main.n1Emoji.text = "？";
            Main.n1Emoji.x = 60;
            Main.n1Emoji.y = 880;
            Main.n1Emoji.size = 200;
            Main.n1Emoji.textColor = 0xFFFF00;
        }
        else if (emoji == "") {
            Main.n0Emoji.text = "";
            Main.n1Emoji.text = "";
        }
    };
    p.createGameScene = function () {
        this.touchEnabled = true;
        var NPC0 = new NPC("npc_0");
        var NPC1 = new NPC("npc_1");
        var taskPanel = new TaskPanel("dialogpanel");
        var taskAllTimePanel = new TaskPanel("taskpanel");
        var taskService = TaskService.getInstance();
        var task = new Task("0", "找到他！", TaskStatus.ACCEPTABLE, "npc_0", "npc_1");
        var N0 = this.createBitmapByName("npc1_png");
        N0.y = 50;
        N0.x = 200;
        N0.width = 360;
        N0.height = 300;
        N0.touchEnabled = true;
        N0.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Main.click = true;
            TaskService.getInstance().notify(task);
        }, this);
        this.addChild(N0);
        var N1 = this.createBitmapByName("npc2_png");
        N1.x = 200;
        N1.y = 838;
        N1.width = 360;
        N1.height = 300;
        N1.touchEnabled = true;
        N1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Main.click = true;
            TaskService.getInstance().notify(task);
        }, this);
        this.addChild(N1);
        this.addChild(Main.n0Emoji);
        this.addChild(Main.n1Emoji);
        this.addChild(Main.content1);
        this.addChild(Main.content2);
        this.addChild(Main.content3);
        this.addChild(Main.content4);
        this.addChild(Main.button);
        this.addChild(Main.taskPanelContent1);
        this.addChild(Main.taskPanelContent2);
        this.addChild(Main.taskPanelContent3);
        this.addChild(Main.taskPanelContent4);
        taskService.addObserver(NPC0);
        taskService.addObserver(NPC1);
        taskService.addObserver(taskPanel);
        taskService.addObserver(taskAllTimePanel);
        taskService.addTask(task);
        taskService.getTaskByCustomRule(function (taskList) {
            for (var i = 0; i < taskList.length; i++) {
                if (taskList[i].getStatus() == TaskStatus.ACCEPTABLE) {
                    taskService.notify(taskList[i]);
                    return taskList[i];
                }
            }
        });
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    p.touchNPC1 = function (evt) {
        console.log("click");
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    //对话任务面板的ui
    Main.content1 = new egret.TextField();
    Main.content2 = new egret.TextField();
    Main.content3 = new egret.TextField();
    Main.content4 = new egret.TextField();
    Main.button = new egret.TextField();
    Main.taskPanelContent1 = new egret.TextField();
    Main.taskPanelContent2 = new egret.TextField();
    Main.taskPanelContent3 = new egret.TextField();
    Main.taskPanelContent4 = new egret.TextField();
    //emoji
    Main.n0Emoji = new egret.TextField();
    Main.n1Emoji = new egret.TextField();
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map
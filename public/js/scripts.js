function Post() {
    var self = this;

    this.template = function(post) {
        post.username = post.user.username;
        post.author_fullname = post.user.first_name + ' ' + post.user.last_name;
        var template = Handlebars.compile($("#post-template").html());
        return template(post);
    };

    this.enableDeletePost = function() {
        // Enable delete post for current user
        if (window.app.user.isLoginned()) {
            var currentUser = window.app.user.currentUser;
            $('.delete-post').hide();
            $('.delete-post[uid='+ currentUser.id +']').show();
        }
    };

    this.addPost = function(data) {
        var html = [];
        if (data.length > 0) {
            var i;
            for (i = 0; i < data.length; i++) {
                var tpl = self.template(data[i]);
                html.push(tpl);
            }
        }
        $("#main .post-anchor").after(html.join(''));
        $(".posted-time").prettyDate();

        self.enableDeletePost();

        // Load all comment
        if (data.length > 0) {
            var i;
            for (i = 0; i < data.length; i++) {
                var comment = new Comment();
                comment.load(data[i].id);
            }
        }
    };

    this.getFormData = function() {
        return {
            user_id : window.app.user.currentUser.id,
            song : $(".stream-quick-post input[name=song]").val(),
            artist : $(".stream-quick-post input[name=artist]").val(),
            comment : $(".stream-quick-post textarea[name=comment]").val()
        }
    };

    this.clearFormData = function() {
        $(".stream-quick-post input[name=song]").val("");
        $(".stream-quick-post input[name=artist]").val("");
        $(".stream-quick-post textarea[name=comment]").val("");
    };

    this.enableForm = function(enable) {
        if (enable) {
            $(".stream-quick-post input[name=song]").removeAttr('disabled');
            $(".stream-quick-post input[name=artist]").removeAttr('disabled');
            $(".stream-quick-post textarea[name=comment]").removeAttr('disabled');
            $(".stream-quick-post .post-submit").removeAttr('disabled');
        } else {
            $(".stream-quick-post input[name=song]").attr("disabled", "disabled");
            $(".stream-quick-post input[name=artist]").attr("disabled", "disabled");
            $(".stream-quick-post textarea[name=comment]").attr("disabled", "disabled");
            $(".stream-quick-post .post-submit").attr("disabled", "disabled");
        }
    };

    this.load = function(uid) {
        var data = uid ? { uid : uid } : null;
        var connector = new Connector();
        connector.list(data,'post', function(data) {
            if (data == 'error') {

            } else {
                self.addPost(data);
            }
        });
    }
}

function Comment() {
    var self = this;
    this.template = function(comment) {
        comment.username = comment.user.username;
        comment.user_fullname = comment.user.first_name + ' ' + comment.user.last_name;
        var template = Handlebars.compile($("#comment-template").html());
        return template(comment);
    };

    this.addComments = function(comments, pid) {
        var $table  = $(".comment-container-" + pid + " table");
        var html = [];
        if (comments.length > 0) {
            var i;
            for (i = 0; i < comments.length; i++) {
                html.push(self.template(comments[i]));
            }
            $table.prepend(html.join(''));
        }
        $(".posted-time").prettyDate();
    };

    this.load = function(pid) {
        var connector = new Connector();
        connector.list({
            pid : pid
        },'comment', function(data) {
            if (data == 'error') {

            } else {
                self.addComments(data, pid);
            }
        });
    }
}

function User() {
    var self = this;
    this.currentUser = null;
    this.selectedUID = null;

    this.isLoginned = function() {
        return (typeof self.currentUser != 'undefined' && self.currentUser != null && typeof self.currentUser.id != 'undefined');
    };

    this.showLoginModal = function() {
        $(".login-message").html('');
        $("#loginModal input[name=username]").val('');
        $("#loginModal input[name=password]").val('');
        $("#loginModal").modal('show');
    };

    this.getUser = function(uid,callback) {
        $.ajax({
            type: "POST",
            url: "handler/user.php",
            data: {
                type: "get",
                uid : uid
            }
        }).done(function( resp ) {
            try {
                var user = JSON.parse(resp);
                $(".user-profile-fullname").html(user.first_name + ' ' + user.last_name);
                if (typeof user.avatar != 'undefined' && user.avatar != null && user.avatar.length > 0) {
                    $(".user-profile-avatar").attr('src', user.avatar);
                } else {
                    $(".user-profile-avatar").attr('src', 'images/no-avatar.png');
                }
                $(".user-profile-container").show();
            } catch (e) {

            }
            if (callback && typeof(callback) === "function") {
                callback(resp);
            }
        });
    };

    this.check = function(callback) {
        $.ajax({
            type: "POST",
            url: "handler/user.php",
            data: {
                type: "current"
            }
        }).done(function( resp ) {
            if (resp == 'Not login') {

            } else {
                try {
                    self.currentUser = JSON.parse(resp);
                } catch (e) {

                }
            }
            self.toggleLogin();
            if (callback && typeof(callback) === "function") {
                callback(resp);
            }
        });
    };

    this.toggleLogin = function() {
        window.app.post.enableDeletePost();
        var html = '';
        if (typeof self.currentUser != 'undefined' && self.currentUser != null) {
            if (self.selectedUID == null || self.currentUser.id == self.selectedUID) {
                $('.stream-quick-post').show();
            }
            $('.stream-quick-sign-up').hide();
            if (typeof self.currentUser.avatar != 'undefined' && self.currentUser.avatar != null && self.currentUser.avatar.length > 0) {
                html = '<img src="' + self.currentUser.avatar + '" class="img-circle user-avatar">';
            } else {
                html = '<img src="images/no-avatar.png" class="img-circle user-avatar">';
            }
            html += (' ' + self.currentUser.first_name + ' ' + self.currentUser.last_name);
        } else {
            $('.stream-quick-post').hide();
            $('.stream-quick-sign-up').show();
            html = '<i class="glyphicon glyphicon-user"></i> Login';
        }
        $("#profileAction").html(html);
    };

    this.logout = function(callback) {
        $.ajax({
            type: "POST",
            url: "handler/user.php",
            data: {
                type: "logout"
            }
        }).done(function( resp ) {
            self.currentUser = null;
            self.toggleLogin();
            if (callback && typeof(callback) === "function") {
                callback(resp);
            }
        });
    };

    this.login = function(username, password, callback) {
        $.ajax({
            type: "POST",
            url: "handler/user.php",
            data: {
                type: "login",
                username: username,
                password: password
            }
        }).done(function( resp ) {
            if (resp == 'Invalid username or password') {
                window.app.showMessage("Could not login", resp, "danger", ".login-message");
            } else {
                try {
                    self.currentUser = JSON.parse(resp);
                    self.toggleLogin();
                    $("#loginModal").modal('hide');
                } catch (e) {
                    window.app.showMessage("Could not login", "", "danger", ".login-message");
                }
            }
            if (callback && typeof(callback) === "function") {
                callback(resp);
            }
        });
    }
}

function Connector() {
    this.save = function(data, target, callback, notAlert) {
        $.ajax({
            type: "POST",
            url: "handler/" + target + ".php",
            data: {
                type: "save",
                data: JSON.stringify(data)
            }
        }).done(function( resp ) {
            // Contain { mean return json object
            if (!notAlert) {
                if (resp.indexOf('{') != -1) {
                    swal("Saved successfully!", "", "success");
                } else {
                    swal("Error!", resp, "warning");
                }
            }
            if (callback && typeof(callback) === "function") {
                callback(resp);
            }
        });
    };

    this.list = function(data, target, callback) {
        if (typeof data == 'undefined' || data == null) {
            data = {};
        }
        data.type = 'list';

        $.ajax({
            type: "POST",
            url: "handler/" + target + ".php",
            data: data
        }).done(function( resp ) {
            if (callback && typeof(callback) === "function") {
                callback(JSON.parse(resp));
            }
        });
    };

    this.delete = function(data, target, callback) {
        $.ajax({
            type: "POST",
            url: "handler/" + target + ".php",
            data: {
                type: "delete",
                data: JSON.stringify(data)
            }
        }).done(function( resp ) {
            // Contain { mean return json object
            if (resp == 'Completed') {
                swal("Deleted successfully!", "", "success");
            } else {
                swal("Error!", resp, "warning");
            }
            if (callback && typeof(callback) === "function") {
                callback(resp);
            }
        });
    };
}

function App(options) {
    this.post = new Post();
    this.user = new User();
    this.comment = new Comment();
    var self = this;
    this.options = options;
    /**
     *  Toggle view between 2 and 3 columns
     */
    this.initToggle = function () {
        $('#btnToggle').click(function(){
            if ($(this).hasClass('on')) {
                $('#main .col-md-6').addClass('col-md-4').removeClass('col-md-6');
                $(this).removeClass('on');
            }
            else {
                $('#main .col-md-4').addClass('col-md-6').removeClass('col-md-4');
                $(this).addClass('on');
            }
        });
    };
    /**
     * Show message inside locator
     * @param title
     * @param message
     * @param locator
     */
    this.showMessage = function (title, message, type, locator) {
        var m = [];
        m.push('<div class="alert alert-' + type + ' alert-dismissable">');
        m.push('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>');
        m.push('<strong>' + title + '</strong> ' + message);
        m.push('</div>');
        $(locator).html(m.join(''));
    };

    this.prettyLinks = function() {
        $(".posted-time").prettyDate();
    };

    this.enableGoToTop = function () {
        // browser window scroll (in pixels) after which the "back to top" link is shown
        var offset = 300,
        //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
            offset_opacity = 1200,
        //duration of the top scrolling animation (in ms)
            scroll_top_duration = 700,
        //grab the "back to top" link
            $back_to_top = $('.cd-top');

        //hide or show the "back to top" link
        $(window).scroll(function(){
            ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
            if( $(this).scrollTop() > offset_opacity ) {
                $back_to_top.addClass('cd-fade-out');
            }
        });
        //smooth scroll to top
        $back_to_top.on('click', function(event){
            event.preventDefault();
            $('body,html').animate({
                    scrollTop: 0
                }, scroll_top_duration
            );
        });
    }

    /**
     * Pretty timer
     */
    this.initPrettyTime = function() {
        self.prettyLinks();
        setInterval(self.prettyLinks, 3000);
    };
    /**
     *  Init all UI event here!
     */
    this.initEvents = function() {
        /**
         *  Click register link on login form
         */
        $("#profile-register").click(function() {
            $("#loginModal").modal('hide');
            self.showProfile();
        });

        $(".quick-signup-button").click(function() {
            self.showProfile({
                email: $("input[name=quick-signup-email]").val()
            }, "quick-sign-up");
        });
        /**
         * Submit sign up information
         */
        $("#profileModal .profile-signup").click(function() {
            var connector = new Connector();
            connector.save({
                first_name : $("#profileModal input[name=firstName]").val(),
                last_name : $("#profileModal input[name=lastName]").val(),
                username : $("#profileModal input[name=username]").val(),
                bio : $("#profileModal textarea[name=bio]").val(),
                email : $("#profileModal input[name=email]").val(),
                password : $("#profileModal input[name=password]").val(),
                gender : $("#profileModal #rdMale").is(":checked")
            }, 'user', function(resp) {
                try {
                    self.user.currentUser = JSON.parse(resp);
                    self.user.toggleLogin();
                } catch(e) {

                }
                $("#profileModal").modal('hide');
            });
            return false;
        });

        /**
         *  Profile update
         */
        $("#profileModal .profile-save").click(function() {
            var connector = new Connector();
            connector.save({
                id : self.user.currentUser.id,
                first_name : $("#profileModal input[name=firstName]").val(),
                last_name : $("#profileModal input[name=lastName]").val(),
                username : $("#profileModal input[name=username]").val(),
                bio : $("#profileModal textarea[name=bio]").val(),
                email : $("#profileModal input[name=email]").val(),
                password : $("#profileModal input[name=password]").val(),
                gender : $("#profileModal #rdMale").is(":checked")
            }, 'user', function(resp) {
                try {
                    self.user.currentUser = JSON.parse(resp);
                    self.user.toggleLogin();
                } catch(e) {

                }
                $("#profileModal").modal('hide');
            });
            return false;
        });

        /**
         *  Show profile or login form
         */
        $('#profileAction').click(function() {
            if (self.user.isLoginned()) {
                self.showProfile(self.user.currentUser);
            } else {
                self.user.showLoginModal();
            }
        });

        /**
         *  Login button click
         */
        $('#loginModal .btn-sign-in').click(function() {
            self.user.login(
                $("#loginModal input[name=email]").val(),
                $("#loginModal input[name=password]").val(),
                function(resp) {
                    $("#loginModal input[name=email]").val('');
                    $("#loginModal input[name=password]").val('');
                }
            )
            return false;
        });
        /**
         *  Logout button click
         */
        $('#profileModal .profile-logout').click(function() {
           self.user.logout(function(resp) {
               $("#profileModal").modal("hide");
           });
        });

        /**
         *  Submit post
         */
        $('.stream-quick-post .post-submit').click(function() {
           self.post.enableForm(false);
            var connector = new Connector();
            var data = self.post.getFormData();
            if (data.comment.length == 0 || data.comment.length > 160
                    || data.song.length == 0 || data.artist.length == 0) {
                self.post.enableForm(true);
                return false;
            }
            connector.save(data, "post", function(resp) {
                self.post.enableForm(true);
                self.post.clearFormData();
                var posts = [];
                posts.push(JSON.parse(resp));
                self.post.addPost(posts);
            });
        });

        $(document).keypress(function (e) {
            var $target = $(e.target);
            if (e.which == 13 && $target.hasClass('input-comment')) {
                if (self.user.isLoginned()) {
                    var pid = $target.attr('pid');
                    var val = $target.val();
                    // comment should not empty and length less than 160
                    if (val.length == 0 || val.length > 160) return false;
                    var connect = new Connector();
                    connect.save({
                        post_id: pid,
                        user_id: self.user.currentUser.id,
                        comment: val
                    }, 'comment', function (resp) {
                        $target.val("");
                        var comments = [];
                        var c = JSON.parse(resp);
                        comments.push(c);
                        self.comment.addComments(comments, c.post_id);
                    }, true);
                    return false;
                } else {
                    self.user.showLoginModal();
                }
            }
        });

        $(document).click(function(e) {
           var $target = $(e.target);
            /**
             *  Handler post comment
             */
            if ($target.hasClass('button-comment')) {
                if (self.user.isLoginned()) {
                    var $input = $target.closest('.input-group').find('.input-comment');
                    var pid = $input.attr('pid');
                    var connect = new Connector();
                    var val = $input.val();
                    // comment should not empty and length less than 160
                    if (val.length == 0 || val.length > 160) return false;
                    connect.save({
                        post_id: pid,
                        user_id: self.user.currentUser.id,
                        comment: val
                    }, 'comment', function (resp) {
                        $input.val("");
                        var comments = [];
                        var c = JSON.parse(resp);
                        comments.push(c);
                        self.comment.addComments(comments, c.post_id);
                    }, true);
                } else {
                    self.user.showLoginModal();
                }
            } else if ($target.hasClass('delete-post')) {
                swal({
                        title: "Are you sure?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false,
                        closeOnCancel: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            var pid = $target.attr("pid");
                            var connect = new Connector();
                            connect.delete({
                                id : pid
                            },'post', function(resp) {
                                if (resp == 'Completed') {
                                    swal("Deleted successfully!", "", "success");
                                    $('.post-container[pid='+pid+']').remove();
                                } else {
                                    swal("Error!", resp, "warning");
                                }
                            });
                        }
                    });
            }
        });
    };
    /**
     *  Show profile modal
     * @param profile
     *  if profile is null show Sign up form
     *  if profile is not null show update form, enable logout function
     */
    this.showProfile = function(profile, type) {
        if (typeof profile != 'undefined' && profile != null && typeof type == 'undefined') {
            $("#profileModal input[name=firstName]").val(profile.first_name || '');
            $("#profileModal input[name=lastName]").val(profile.last_name || '');
            $("#profileModal input[name=username]").val(profile.username || '');
            $("#profileModal textarea[name=bio]").val(profile.bio || '');
            $("#profileModal input[name=email]").val(profile.email || '');

            if (profile.gender) {
                $("#profileModal #rdMale").attr("checked", "checked");
            } else {
                $("#profileModal #rdFemale").attr("checked", "checked");
            }

            $("#profileModal .profile-type-signup").hide();
            $("#profileModal .profile-type-update").show();

            $("#profileModal .profile-title").html('<img src="' + (profile.avatar || 'images/no-avatar.png') + '" class="img-circle"><br>Profile');
        } else {
            if (typeof profile != 'undefined' && profile != null)
                $("#profileModal input[name=email]").val(profile.email || '');
            $("#profileModal input[name=firstName]").val('');
            $("#profileModal input[name=lastName]").val('');
            $("#profileModal input[name=username]").val('');
            $("#profileModal textarea[name=bio]").val('');
            $("#profileModal #rdMale").attr("checked", "checked");

            $("#profileModal .profile-type-signup").show();
            $("#profileModal .profile-type-update").hide();
            $("#profileModal .profile-title").html('Sign up!');
        }
        $("#profileModal input[name=password]").val('');
        $('#profileModal').modal('show');
    };

    /**
     *  Application init
     */
    this.init = function() {
        var uid = window.location.hash.length > 0 ? window.location.hash.substr(1) : '';
        if (uid.length > 0) {
            self.user.selectedUID = uid;
        }
        self.enableGoToTop();
        self.initToggle();
        self.initPrettyTime();
        self.initEvents();
        self.user.check(function() {
            if (uid.length > 0) {
                self.user.getUser(uid);
                self.post.load(uid);
            } else {
                self.post.load()
            }
        });
    }

}

/**
 * Run application when document is ready
 */
$(document).ready(function(){
    window.app = new App();
    window.app.init();
});
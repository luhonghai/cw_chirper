function Post() {
    var self = this;

    this.count = 1;

    this.template = function(post) {
        post.author_fullname = post.user.first_name + ' ' + post.user.last_name;
        var template = Handlebars.compile($("#post-template").html());
        return template(post);
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

function User() {
    var self = this;
    this.currentUser = null;

    this.isLoginned = function() {
        return (typeof self.currentUser != 'undefined' && self.currentUser != null && typeof self.currentUser.id != 'undefined');
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
        var html = '';
        if (typeof self.currentUser != 'undefined' && self.currentUser != null) {
            $('.stream-quick-post').show();
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
    this.save = function(data, target, callback) {
        $.ajax({
            type: "POST",
            url: "handler/" + target + ".php",
            data: {
                type: "save",
                data: JSON.stringify(data)
            }
        }).done(function( resp ) {
            // Contain { mean return json object
            if (resp.indexOf('{') != -1) {
                swal("Saved successfully!", "", "success");
            } else {
                swal("Error!", resp, "warning");
            }
            if (callback && typeof(callback) === "function") {
                callback(resp);
            }
        });
    };

    this.list = function(data, target, callback) {
        $.ajax({
            type: "POST",
            url: "handler/" + target + ".php",
            data: {
                type: "list",
                data: data
            }
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
    }

    this.prettyLinks = function() {
        $(".posted-time").prettyDate();
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
                $(".login-message").html('');
                $("#loginModal input[name=username]").val('');
                $("#loginModal input[name=password]").val('');
                $("#loginModal").modal('show');
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
            connector.save(self.post.getFormData(), "post", function(resp) {
                self.post.enableForm(true);
                self.post.clearFormData();
                var posts = [];
                posts.push(JSON.parse(resp));
                self.post.addPost(posts);
            });
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
        self.initToggle();
        self.initPrettyTime();
        self.initEvents();
        self.user.check(function() {
            if (self.user.isLoginned()) {
                self.post.load(self.user.currentUser.id);
            } else {
                self.post.load();
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
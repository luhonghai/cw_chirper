
<!-- User profile -->
<div id="profileModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h2 class="text-center profile-title"><img src="images/no-avatar.png" class="img-circle"><br>Profile</h2>
            </div>
            <div class="modal-body">
                <div class="form col-md-12 center-block">
                    <div class="row">
                        <div class="form-group col-xs-6">
                            <input type="text" name="firstName" class="form-control input-lg" placeholder="First name">
                        </div>
                        <div class="form-group col-xs-6">
                            <input type="text" name="lastName" class="form-control input-lg" placeholder="Last name">
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="username" class="form-control input-lg" placeholder="Your username">
                    </div>
                    <div class="form-group">
                        <input type="text" name="email" class="form-control input-lg" placeholder="Your email">
                    </div>
                    <div class="form-group">
                        <textarea type="text" name="bio" class="form-control input-lg" placeholder="Your bio"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="radio-inline input-lg">
                            <input type="radio" name="gender" id="rdMale" value="Male" checked="checked"> Male
                        </label>
                        <label class="radio-inline input-lg">
                            <input type="radio" name="gender" id="rdFemale" value="Female"> Female
                        </label>
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" class="form-control input-lg" placeholder="Password">
                    </div>
                    <div class="row profile-type-update" style="display: none">
                        <div class="form-group col-xs-6">
                            <button class="btn btn-danger btn-lg btn-block profile-logout">Logout</button>
                        </div>
                        <div class="form-group col-xs-6">
                            <button class="btn btn-primary btn-lg btn-block profile-save">Update</button>
                        </div>
                    </div>
                    <div class="form-group profile-type-signup" style="display: none">
                        <button class="btn btn-primary btn-lg btn-block profile-signup">Sign up</button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">

            </div>
        </div>
    </div>
</div>


<!--login modal-->
<div id="loginModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h2 class="text-center"><img src="images/no-avatar.png" class="img-circle"><br>Login</h2>
            </div>
            <div class="modal-body">
                <div class="login-message"></div>
                <form class="form col-md-12 center-block" action="handler/login.php" method="POST">
                    <div class="form-group">
                        <input type="text" name="email" class="form-control input-lg" placeholder="Email">
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" class="form-control input-lg" placeholder="Password">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-lg btn-block btn-sign-in">Sign In</button>
                        <span><a href="#" id="profile-register">Register</a></span>
                    </div>
                </form>
            </div>
            <div class="modal-footer">

            </div>
        </div>
    </div>
</div>


<!--about modal-->
<div id="aboutModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h2 class="text-center">Chirper</h2>
            </div>
            <div class="modal-body">
                <div class="col-md-12 text-center">
                    <p>Social Networking Music</p><br>
                </div>
                <div class="col-md-12 text-center">
                    <a href="http://www.bootply.com/DwnjTNuvVt">Use Bootstrap Template</a><br>was made with <i class="glyphicon glyphicon-heart"></i> by <a href="http://bootply.com/templates">Bootply</a>
                    <br><br>
                    © 2014 Styve Simen
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" data-dismiss="modal" aria-hidden="true">OK</button>
            </div>
        </div>
    </div>
</div>


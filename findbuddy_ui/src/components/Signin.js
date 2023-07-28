function Signin(){
    return(
        <div class='container w-50 mt-5'>
            <form>
                <h5>Sign in</h5>
                <div class='form-row mt-3'>
                    <div class='form-group col-md-6'>
                        <label for='email' class='form-label'>Email</label>
                        <input type='email' id='email' class='form-control'/>      
                    </div>
                    <div class="form-group col-md-6">
                        <label for="password">Password</label>
                         <input type="password" class="form-control" id="password"/>
                    </div>
                </div> 
                <button type="submit" class="btn btn-primary">Sign in</button>
            </form>
        </div>
    )
}

export default Signin;
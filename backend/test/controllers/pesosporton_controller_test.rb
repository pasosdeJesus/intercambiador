class PesosportonControllerTest < ActionController::TestCase
  setup do
    skip
    @pesoporton = Pesoporton(:one)
  end

  test "should get index" do
    skip
    get :index
    assert_response :success
    assert_not_nil assigns(:pesoporton)
  end

  test "should get new" do
    skip
    get :new
    assert_response :success
  end

  test "should create pesoporton" do
    skip
    assert_difference('Pesoporton.count') do
      post :create, pesoporton: { created_at: @pesoporton.created_at, fechacreacion: @pesoporton.fechacreacion, fechadeshabilitacion: @pesoporton.fechadeshabilitacion, nombre: @pesoporton.nombre, observaciones: @pesoporton.observaciones, updated_at: @pesoporton.updated_at }
    end

    assert_redirected_to pesoporton_path(assigns(:pesoporton))
  end

  test "should show pesoporton" do
    skip
    get :show, id: @pesoporton
    assert_response :success
  end

  test "should get edit" do
    skip
    get :edit, id: @pesoporton
    assert_response :success
  end

  test "should update pesoporton" do
    skip
    patch :update, id: @pesoporton, pesoporton: { created_at: @pesoporton.created_at, fechacreacion: @pesoporton.fechacreacion, fechadeshabilitacion: @pesoporton.fechadeshabilitacion, nombre: @pesoporton.nombre, observaciones: @pesoporton.observaciones, updated_at: @pesoporton.updated_at }
    assert_redirected_to pesoporton_path(assigns(:pesoporton))
  end

  test "should destroy pesoporton" do
    skip
    assert_difference('Pesoporton.count', -1) do
      delete :destroy, id: @pesoporton
    end

    assert_redirected_to pesoportones_path
  end
end

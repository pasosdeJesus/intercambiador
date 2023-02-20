class AnunciosController < ApplicationController
  before_action :set_anuncio, only: %i[ show update destroy ]

  # GET /anuncios
  # GET /anuncios.json
  def index
    @anuncios = Anuncio.all
  end

  # GET /anuncios/1
  # GET /anuncios/1.json
  def show
  end

  # POST /anuncios
  # POST /anuncios.json
  def create
    @anuncio = Anuncio.new(anuncio_params)

    if @anuncio.save
      render :show, status: :created, location: @anuncio
    else
      render json: @anuncio.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /anuncios/1
  # PATCH/PUT /anuncios/1.json
  def update
    if @anuncio.update(anuncio_params)
      render :show, status: :ok, location: @anuncio
    else
      render json: @anuncio.errors, status: :unprocessable_entity
    end
  end

  # DELETE /anuncios/1
  # DELETE /anuncios/1.json
  def destroy
    @anuncio.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_anuncio
      @anuncio = Anuncio.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def anuncio_params
      params.require(:anuncio).permit(:ton, :margenflotante, :limiteinferior, :maximotiempo, :usuario_id)
    end
end

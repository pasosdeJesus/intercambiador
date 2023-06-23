module Admin
  class MetodosdepagoController < Msip::Admin::BasicasController
    before_action :set_metododepago, 
      only: [:show, :edit, :update, :destroy]
    load_and_authorize_resource  class: ::Metododepago

    def clase 
      "::Metododepago"
    end

    def set_metododepago
      @basica = Metododepago.find(params[:id])
    end

    def atributos_index
      [
        :id, 
        :nombre, 
        :observaciones, 
        :fechacreacion_localizada, 
        :habilitado
      ]
    end

    def genclase
      'M'
    end

    def metododepago_params
      params.require(:metododepago).permit(*atributos_form)
    end

  end
end

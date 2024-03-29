class Ability  < Msip::Ability


  def nobasicas_indice_seq_con_id
    Msip::Ability::NOBASICAS_INDSEQID + [
      ["", "Anuncioventa"]
    ]
  end

  # Se definen habilidades con cancancan
  # @usuario Usuario que hace petición
  def initialize(usuario = nil)
    # El primer argumento para can es la acción a la que se da permiso,
    # el segundo es el recurso sobre el que puede realizar la acción,
    # el tercero opcional es un diccionario de condiciones para filtrar
    # más (e.g :publicado => true).
    #
    # El primer argumento puede ser :manage para indicar toda acción,
    # o grupos de acciones como :read (incluye :show e :index),
    # :create, :update y :destroy.
    #
    # Si como segundo argumento usa :all se aplica a todo recurso,
    # o puede ser una clase.
    #
    # Detalles en el wiki de cancan:
    #   https://github.com/ryanb/cancan/wiki/Defining-Abilities

    # Sin autenticación puede consultarse información geográfica
    #can :read, [Msip::Pais, Msip::Departamento, Msip::Municipio, Msip::Clase]
    # No se autorizan usuarios con fecha de deshabilitación
#    if !usuario || usuario.fechadeshabilitacion
#      return
#    end
#    can :contar, Msip::Ubicacion
#    can :buscar, Msip::Ubicacion
#    can :lista, Msip::Ubicacion
#    can :descarga_anexo, Msip::Anexo
#    can :nuevo, Msip::Ubicacion
#    if usuario && usuario.rol then
#      case usuario.rol
#      when Ability::ROLANALI
#        can :read, Msip::Orgsocial
#        can :read, Msip::Persona
#        can :read, Msip::Ubicacion
#        can :new, Msip::Ubicacion
#        can [:update, :create, :destroy], Msip::Ubicacion
#      when Ability::ROLADMIN
        can :manage, Msip::Orgsocial
        can :manage, Msip::Persona
        can :manage, Msip::Respaldo7z
        can :manage, Msip::Ubicacion
        can :manage, ::Pesoporton
        can :manage, ::Usuario
        can :manage, :tablasbasicas
        self.tablasbasicas.each do |t|
          c = Ability.tb_clase(t)
          can :manage, c
        end
#      end
#    end
  end # def initialize

end

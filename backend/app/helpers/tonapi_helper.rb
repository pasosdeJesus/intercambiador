# frozen_string_literal: true

module TonapiHelper

  def getAccountInfo(direccion, red, prob)
    url = red + "/v1/account/getInfo" + "?account=#{direccion}"
    resp = Msip::InternetHelper::obtener(url, prob)
    if resp.nil?
      return [prob]
    end
    return JSON.parse(resp)
  end
  module_function :getAccountInfo

end

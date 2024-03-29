package config

import (
	"log"

	"github.com/caarlos0/env/v6"
)

var Config = struct {
	Port int `env:"PORT" envDefault:"8081"`
}{}

var Tonapi = struct {
	MainNetURI string `env:"TONAPI_MAINNET_URI" envDefault:"https://tonapi.io"`
	TestNetURI string `env:"TONAPI_TESTNET_URI" envDefault:"https://testnet.tonapi.io"`
	Token      string `env:"TONAPI_TOKEN,required"`
}{}

var Proof = struct {
	PayloadLifeTimeSec int64  `env:"TONPROOF_PAYLOAD_LIFETIME_SEC" envDefault:"300"`
	ProofLifeTimeSec   int64  `env:"TONPROOF_PROOF_LIFETIME_SEC" envDefault:"300"`
	ExampleDomain      string `env:"INTERCAMBIADOR_DOMAIN" envDefault:"intercambiadordev.pasosdeJesus.org"`
	Hs256Secret        string `env:"HS256_SECRET,required"`
}{}

func LoadConfig() {
	if err := env.Parse(&Config); err != nil {
		log.Fatalf("config parsing failed: %v\n", err)
	}
	if err := env.Parse(&Tonapi); err != nil {
		log.Panicf("[‼️  Config parsing failed] %+v\n", err)
	}
	if err := env.Parse(&Proof); err != nil {
		log.Panicf("[‼️  Config parsing failed] %+v\n", err)
	}
}
